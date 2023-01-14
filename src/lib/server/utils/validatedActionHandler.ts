import {
  fail,
  type Action,
  type ActionFailure,
  type RequestEvent,
} from '@sveltejs/kit'
import type { z } from 'zod'
import type { MaybePromise } from '$app/forms'

type FormErrorsType<keys extends string | number | symbol> = {
  errors: {
    formErrors?: string[]
    fieldErrors?: {
      [P in keys]?: string
    }
    errors?: string[]
  }
}
export const validatedActionHandler = <
  RouteParams extends Partial<Record<string, string>>,
  RouteId extends string | null,
  ValidatedInput extends Record<string, any>,
  FunctionReturn extends Record<string, any>
>({
  validator,
  processingFunction,
}: {
  validator: z.Schema<ValidatedInput>
  processingFunction: (data: {
    requestData: RequestEvent<RouteParams, RouteId>
    input: ValidatedInput
  }) => MaybePromise<
    ActionFailure<FormErrorsType<keyof ValidatedInput>> | FunctionReturn
  >
}) => {
  const actionFunction = (async (
    inputData
  ): Promise<
    ActionFailure<FormErrorsType<keyof ValidatedInput>> | FunctionReturn
  > => {
    const validatedData = validator.safeParse(
      Object.fromEntries(await inputData.request.formData())
    )

    if (!validatedData.success) {
      const errorInfo = validatedData.error.flatten()
      const fieldErrors = errorInfo.fieldErrors as unknown as Record<
        keyof ValidatedInput,
        string
      >
      const formErrors = errorInfo.formErrors
      return fail(400, { errors: { formErrors, fieldErrors } })
    }

    return processingFunction({
      requestData: inputData,
      input: validatedData.data,
    })
  }) satisfies Action<RouteParams, void | Record<string, any>, RouteId>

  return actionFunction
}
