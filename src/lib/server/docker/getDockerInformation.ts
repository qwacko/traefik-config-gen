import Docker from 'dockerode'
import { z } from 'zod'

const dockerInfoValidation = z.array(
  z
    .object({
      Names: z.array(z.string()),
      Labels: z.object({}).catchall(z.string()),
      Ports: z.array(z.any()),
    })
    .strip()
)

export const getDockerInformation = async () => {
  const docker = new Docker()
  const dockerInfo = await docker.listContainers()
  const validatedDockerInfo = dockerInfoValidation.safeParse(dockerInfo)

  if (validatedDockerInfo.success) {
    console.log('Docker Info', validatedDockerInfo.data)
  } else {
    console.log('Docker Info Error', validatedDockerInfo.error.errors)
  }
}
