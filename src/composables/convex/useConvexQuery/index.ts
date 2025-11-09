import type { FunctionArgs, FunctionReference, FunctionReturnType } from "convex/server";
import type { Ref } from "vue";
import type { OptionalRestArgsAndOptions } from "../optional.types.ts";
import type { UseConvexQueryOptions, UseConvexQueryReturn } from "../queryReturn.types.ts";
import { getFunctionName } from "convex/server";
import { computed, onScopeDispose, ref, watch } from "vue";
import { useConvexClient } from "../useConvexClient.ts";
import { useQueryArgs } from "./lib/useQueryArgs.ts";

/**
 * A composable that provides a Realtime Convex query. It supports reactivity and can be used both on the client and server side.
 * @param query The Convex query function.
 * @param rest The arguments and options for the query.
 * @returns The result of the query.
 */
export function useLocalConvexQuery<Query extends FunctionReference<"query">>(
  query: Query,
  ...rest: OptionalRestArgsAndOptions<Query, UseConvexQueryOptions>
): UseConvexQueryReturn<Query> {
  const { args, options } = useQueryArgs(rest);

  const isServer = typeof window === "undefined";

  const convex = useConvexClient();

  // Initial data
  const data: Ref<FunctionReturnType<Query> | undefined> = ref<
    FunctionReturnType<Query> | undefined
  >(convex.client.localQueryResult(getFunctionName(query), args.value));
  const error = ref<Error | null>(null);

  const suspense = () => {
    if (data.value) {
      return Promise.resolve(data.value);
    }
    if (error.value) {
      return Promise.reject(error.value);
    }

    return new Promise<FunctionReturnType<Query>>((resolve, reject) => {
      const stop = watch(
        () => [data.value, error.value],
        ([newData, newError]) => {
          if (newData) {
            stop();
            resolve(newData);
          } else if (newError) {
            stop();
            reject(newError);
          }
        },
        { immediate: true },
      );
    });
  };

  const handleError = (err: Error) => {
    data.value = null;
    error.value = err;
  };

  const handleResult = (result: FunctionReturnType<Query>) => {
    data.value = result;
    error.value = null;
  };

  const refetch = async () => {
    try {
      const result = await convex.query(query, args.value);
      handleResult(result);
      return result;
    } catch (err) {
      const error_ = err instanceof Error ? err : new Error("Unknown error occurred");
      handleError(error_);
      throw error_;
    }
  };

  const createSubscription = (args: FunctionArgs<Query>) => {
    return convex.onUpdate(query, args, handleResult, handleError);
  };

  // recreate subscription when args change
  let cancelSubscription: () => void | undefined;
  watch(
    args,
    (newArgs) => {
      cancelSubscription?.();

      data.value = null;
      error.value = null;

      cancelSubscription = createSubscription(newArgs);
    },
    {
      immediate: true,
    },
  );

  // cleanup subscription when component is unmounted
  onScopeDispose(() => cancelSubscription?.());

  return {
    data,
    error,
    isPending: computed(() => data.value === null || data.value === undefined),
    suspense,
    refetch,
  };
}
