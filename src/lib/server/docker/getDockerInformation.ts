import Docker from 'dockerode'
import { z } from 'zod'

const dockerInfoValidation = z.array(z.object({}))

export const getDockerInformation = async () => {
  const docker = new Docker()
  const dockerInfo = await docker.listContainers()

  console.log('Docker Info', dockerInfo)
}
