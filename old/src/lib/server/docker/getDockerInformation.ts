import { TRPCError } from '@trpc/server'
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

export const getDockerInformation = async ({
  socketPath,
}: {
  socketPath?: string
}) => {
  const docker = new Docker({ socketPath })
  const dockerInfo = await docker.listContainers()
  const validatedDockerInfo = dockerInfoValidation.safeParse(dockerInfo)

  if (validatedDockerInfo.success) {
    return validatedDockerInfo.data
  } else {
    throw new TRPCError({
      message: 'Error Getting Docker Info',
      code: 'INTERNAL_SERVER_ERROR',
    })
  }
}
