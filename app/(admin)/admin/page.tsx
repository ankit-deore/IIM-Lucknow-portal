import { prisma } from '@/lib/prisma';
import { StatCard } from '@/components/admin/StatCard';
import { Users, UserX, UserCheck, Megaphone, Video, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [
    totalActive,
    pendingLogin,
    deactivated,
    announcements,
    sessionsThisMonth,
    upcomingClasses,
    programmeBreakdown,
    recentActivity,
  ] = await Promise.all([
    prisma.user.count({ where: { status: 'ACTIVE', userType: 'STUDENT' } }),
    prisma.user.count({ where: { status: 'DORMANT', userType: 'STUDENT' } }),
    prisma.user.count({ where: { status: 'DEACTIVATED', userType: 'STUDENT' } }),
    prisma.announcement.count({
      where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }
    }),
    prisma.mockInterviewSession.count({
      where: {
        status: 'COMPLETED',
        updatedAt: { gte: new Date(new Date().setDate(1)) }
      }
    }),
    prisma.timetableSession.count({
      where: {
        date: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    prisma.studentProfile.groupBy({
      by: ['programme'],
      _count: { userId: true },
    }),
    prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    })
  ]);

  // To get the status breakdown per programme efficiently, we'll fetch all students and group in memory 
  // since prisma groupBy with relation filtering is limited.
  const allStudents = await prisma.user.findMany({
    where: { userType: 'STUDENT' },
    include: { profile: true }
  });

  const progStats = ['IPMX', 'PGPSM', 'PGPWE', 'DGMP'].map(prog => {
    const studentsInProg = allStudents.filter(s => s.profile?.programme === prog);
    return {
      programme: prog,
      total: studentsInProg.length,
      active: studentsInProg.filter(s => s.status === 'ACTIVE').length,
      dormant: studentsInProg.filter(s => s.status === 'DORMANT').length,
      deactivated: studentsInProg.filter(s => s.status === 'DEACTIVATED').length,
    };
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Active Students" 
          value={totalActive} 
          subtitle="Fully registered accounts" 
          icon={UserCheck} 
          iconColorClass="text-green-600" 
        />
        <StatCard 
          title="Pending First Login" 
          value={pendingLogin} 
          subtitle="Invited but haven't logged in" 
          icon={Users} 
          iconColorClass="text-amber-500" 
        />
        <StatCard 
          title="Deactivated Accounts" 
          value={deactivated} 
          subtitle="Access revoked" 
          icon={UserX} 
          iconColorClass="text-red-600" 
        />
        <StatCard 
          title="Announcements" 
          value={announcements} 
          subtitle="Published in last 30 days" 
          icon={Megaphone} 
          iconColorClass="text-blue-500" 
        />
        <StatCard 
          title="Sessions This Month" 
          value={sessionsThisMonth} 
          subtitle="Completed mock interviews" 
          icon={Video} 
          iconColorClass="text-purple-500" 
        />
        <StatCard 
          title="Upcoming Classes" 
          value={upcomingClasses} 
          subtitle="Scheduled in next 7 days" 
          icon={Calendar} 
          iconColorClass="text-teal-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Programme Breakdown */}
        <div className="lg:col-span-2 bg-white border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-text-primary">Programme Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface text-text-secondary uppercase">
                <tr>
                  <th className="px-6 py-3 font-medium">Programme</th>
                  <th className="px-6 py-3 font-medium text-center">Total</th>
                  <th className="px-6 py-3 font-medium text-center">Active</th>
                  <th className="px-6 py-3 font-medium text-center">Dormant</th>
                  <th className="px-6 py-3 font-medium text-center">Deactivated</th>
                </tr>
              </thead>
              <tbody>
                {progStats.map(stat => (
                  <tr key={stat.programme} className="border-b border-border last:border-0 hover:bg-surface/50">
                    <td className="px-6 py-4 font-medium text-primary">{stat.programme}</td>
                    <td className="px-6 py-4 text-center">{stat.total}</td>
                    <td className="px-6 py-4 text-center text-green-600">{stat.active}</td>
                    <td className="px-6 py-4 text-center text-amber-500">{stat.dormant}</td>
                    <td className="px-6 py-4 text-center text-red-500">{stat.deactivated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-border rounded-lg shadow-sm flex flex-col h-full">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-text-primary">Recent Activity</h3>
          </div>
          <div className="p-0 flex-1 overflow-y-auto max-h-[400px]">
            {recentActivity.length === 0 ? (
              <div className="p-6 text-center text-text-secondary text-sm">
                No admin activity yet.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recentActivity.map((log) => (
                  <li key={log.id} className="p-4 hover:bg-surface/30">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-text-primary truncate" title={log.action}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-text-secondary whitespace-nowrap ml-2">
                        {formatDistanceToNow(log.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs px-2 py-1 bg-surface text-text-secondary rounded">
                        {log.entityType}
                      </span>
                      <span className="text-xs text-text-secondary truncate max-w-[120px]" title={log.adminEmail}>
                        {log.adminEmail}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
