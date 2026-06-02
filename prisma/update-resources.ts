import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const resources = [
    { 
      programme: 'PGPSM', 
      driveUrl: 'https://drive.google.com/drive/folders/1Dt-8vKu_h0lNMtJ_0EyPqQz0RY_QRrej?usp=drive_link'
    },
    { 
      programme: 'IPMX',  
      driveUrl: 'https://drive.google.com/drive/folders/1DVohI0zBwnICqXGNHbiRr6NxSodrZAP_?usp=drive_link'
    },
    { 
      programme: 'PGPWE', 
      driveUrl: 'https://drive.google.com/drive/folders/1rXamNgW6cJgMS_mg_9LRu5OVHpMihV-I?usp=drive_link'
    },
    { 
      programme: 'DGMP',  
      driveUrl: 'https://drive.google.com/drive/folders/1It1ilj1FsxQAXdjgvZqqkH9_haNgd7XR?usp=drive_link'
    },
  ]

  for (const resource of resources) {
    await prisma.programmeResource.upsert({
      where:  { programme: resource.programme },
      update: { 
        driveUrl: resource.driveUrl, 
        updatedBy: 'system@gurukul-seed' 
      },
      create: { 
        programme: resource.programme, 
        driveUrl:  resource.driveUrl, 
        updatedBy: 'system@gurukul-seed' 
      },
    })
    console.log(`Updated ${resource.programme}`)
  }

  console.log('All programme resources updated.')
  await prisma.$disconnect()
}

main().catch(console.error)
