import type { DataTag, DefinedInitialDataOptions, DefinedUseQueryResult, QueryClient, QueryKey, UndefinedInitialDataOptions, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { Activity, ActivityInput, ActivityUpdate, Announcement, AnnouncementInput, AnnouncementUpdate, DashboardSummary, HealthStatus, LoginAccountInput, RegisterAccountInput, SchoolUser } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof healthCheck>>, TError, Awaited<ReturnType<typeof healthCheck>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof healthCheck>>, TError, Awaited<ReturnType<typeof healthCheck>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getRegisterAccountUrl: () => string;
/**
 * @summary Register an account with an optional administrator code
 */
export declare const registerAccount: (registerAccountInput: RegisterAccountInput, options?: Parameters<typeof customFetch>[1]) => Promise<SchoolUser>;
export declare const getRegisterAccountMutationKey: () => readonly ["registerAccount"];
export declare const getRegisterAccountMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof registerAccount>>, TError, RegisterAccountMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof registerAccount>>, TError, RegisterAccountMutationVariables, TContext>;
export type RegisterAccountMutationResult = NonNullable<Awaited<ReturnType<typeof registerAccount>>>;
export type RegisterAccountMutationBody = BodyType<RegisterAccountInput>;
export type RegisterAccountMutationError = ErrorType<void>;
export type RegisterAccountMutationVariables = {
    data: BodyType<RegisterAccountInput>;
};
/**
* @summary Register an account with an optional administrator code
*/
export declare const useRegisterAccount: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof registerAccount>>, TError, RegisterAccountMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof registerAccount>>, TError, RegisterAccountMutationVariables, TContext>;
export declare const getLoginAccountUrl: () => string;
/**
 * @summary Sign in with a username and password
 */
export declare const loginAccount: (loginAccountInput: LoginAccountInput, options?: Parameters<typeof customFetch>[1]) => Promise<SchoolUser>;
export declare const getLoginAccountMutationKey: () => readonly ["loginAccount"];
export declare const getLoginAccountMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof loginAccount>>, TError, LoginAccountMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof loginAccount>>, TError, LoginAccountMutationVariables, TContext>;
export type LoginAccountMutationResult = NonNullable<Awaited<ReturnType<typeof loginAccount>>>;
export type LoginAccountMutationBody = BodyType<LoginAccountInput>;
export type LoginAccountMutationError = ErrorType<void>;
export type LoginAccountMutationVariables = {
    data: BodyType<LoginAccountInput>;
};
/**
* @summary Sign in with a username and password
*/
export declare const useLoginAccount: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof loginAccount>>, TError, LoginAccountMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof loginAccount>>, TError, LoginAccountMutationVariables, TContext>;
export declare const getLogoutAccountUrl: () => string;
/**
 * @summary Sign out the current account
 */
export declare const logoutAccount: (options?: Parameters<typeof customFetch>[1]) => Promise<void>;
export declare const getLogoutAccountMutationKey: () => readonly ["logoutAccount"];
export declare const getLogoutAccountMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logoutAccount>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof logoutAccount>>, TError, void, TContext>;
export type LogoutAccountMutationResult = NonNullable<Awaited<ReturnType<typeof logoutAccount>>>;
export type LogoutAccountMutationError = ErrorType<unknown>;
/**
* @summary Sign out the current account
*/
export declare const useLogoutAccount: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logoutAccount>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof logoutAccount>>, TError, void, TContext>;
export declare const getGetCurrentUserUrl: () => string;
/**
 * @summary Get the signed-in student or administrator
 */
export declare const getCurrentUser: (options?: Parameters<typeof customFetch>[1]) => Promise<SchoolUser>;
export declare const getGetCurrentUserQueryKey: () => readonly ["/api/me"];
export declare const getGetCurrentUserQueryOptions: <TData = Awaited<ReturnType<typeof getCurrentUser>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type GetCurrentUserQueryResult = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
export type GetCurrentUserQueryError = ErrorType<void>;
export declare function useGetCurrentUser<TData = Awaited<ReturnType<typeof getCurrentUser>>, TError = ErrorType<void>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, Awaited<ReturnType<typeof getCurrentUser>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useGetCurrentUser<TData = Awaited<ReturnType<typeof getCurrentUser>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, Awaited<ReturnType<typeof getCurrentUser>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useGetCurrentUser<TData = Awaited<ReturnType<typeof getCurrentUser>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getGetDashboardSummaryUrl: () => string;
/**
 * @summary Get the agenda overview
 */
export declare const getDashboardSummary: (options?: Parameters<typeof customFetch>[1]) => Promise<DashboardSummary>;
export declare const getGetDashboardSummaryQueryKey: () => readonly ["/api/dashboard-summary"];
export declare const getGetDashboardSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type GetDashboardSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardSummary>>>;
export type GetDashboardSummaryQueryError = ErrorType<void>;
export declare function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<void>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, Awaited<ReturnType<typeof getDashboardSummary>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, Awaited<ReturnType<typeof getDashboardSummary>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getListActivitiesUrl: () => string;
/**
 * @summary List all class activities
 */
export declare const listActivities: (options?: Parameters<typeof customFetch>[1]) => Promise<Activity[]>;
export declare const getListActivitiesQueryKey: () => readonly ["/api/activities"];
export declare const getListActivitiesQueryOptions: <TData = Awaited<ReturnType<typeof listActivities>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listActivities>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listActivities>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type ListActivitiesQueryResult = NonNullable<Awaited<ReturnType<typeof listActivities>>>;
export type ListActivitiesQueryError = ErrorType<void>;
export declare function useListActivities<TData = Awaited<ReturnType<typeof listActivities>>, TError = ErrorType<void>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof listActivities>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof listActivities>>, TError, Awaited<ReturnType<typeof listActivities>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListActivities<TData = Awaited<ReturnType<typeof listActivities>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listActivities>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof listActivities>>, TError, Awaited<ReturnType<typeof listActivities>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListActivities<TData = Awaited<ReturnType<typeof listActivities>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listActivities>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getCreateActivityUrl: () => string;
/**
 * @summary Publish an activity
 */
export declare const createActivity: (activityInput: ActivityInput, options?: Parameters<typeof customFetch>[1]) => Promise<Activity>;
export declare const getCreateActivityMutationKey: () => readonly ["createActivity"];
export declare const getCreateActivityMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createActivity>>, TError, CreateActivityMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createActivity>>, TError, CreateActivityMutationVariables, TContext>;
export type CreateActivityMutationResult = NonNullable<Awaited<ReturnType<typeof createActivity>>>;
export type CreateActivityMutationBody = BodyType<ActivityInput>;
export type CreateActivityMutationError = ErrorType<void>;
export type CreateActivityMutationVariables = {
    data: BodyType<ActivityInput>;
};
/**
* @summary Publish an activity
*/
export declare const useCreateActivity: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createActivity>>, TError, CreateActivityMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createActivity>>, TError, CreateActivityMutationVariables, TContext>;
export declare const getUpdateActivityUrl: (id: number) => string;
/**
 * @summary Edit an activity
 */
export declare const updateActivity: (id: number, activityUpdate: ActivityUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<Activity>;
export declare const getUpdateActivityMutationKey: () => readonly ["updateActivity"];
export declare const getUpdateActivityMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateActivity>>, TError, UpdateActivityMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateActivity>>, TError, UpdateActivityMutationVariables, TContext>;
export type UpdateActivityMutationResult = NonNullable<Awaited<ReturnType<typeof updateActivity>>>;
export type UpdateActivityMutationBody = BodyType<ActivityUpdate>;
export type UpdateActivityMutationError = ErrorType<void>;
export type UpdateActivityMutationVariables = {
    id: number;
    data: BodyType<ActivityUpdate>;
};
/**
* @summary Edit an activity
*/
export declare const useUpdateActivity: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateActivity>>, TError, UpdateActivityMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateActivity>>, TError, UpdateActivityMutationVariables, TContext>;
export declare const getDeleteActivityUrl: (id: number) => string;
/**
 * @summary Delete an activity
 */
export declare const deleteActivity: (id: number, options?: Parameters<typeof customFetch>[1]) => Promise<void>;
export declare const getDeleteActivityMutationKey: () => readonly ["deleteActivity"];
export declare const getDeleteActivityMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteActivity>>, TError, DeleteActivityMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteActivity>>, TError, DeleteActivityMutationVariables, TContext>;
export type DeleteActivityMutationResult = NonNullable<Awaited<ReturnType<typeof deleteActivity>>>;
export type DeleteActivityMutationError = ErrorType<void>;
export type DeleteActivityMutationVariables = {
    id: number;
};
/**
* @summary Delete an activity
*/
export declare const useDeleteActivity: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteActivity>>, TError, DeleteActivityMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof deleteActivity>>, TError, DeleteActivityMutationVariables, TContext>;
export declare const getListAnnouncementsUrl: () => string;
/**
 * @summary List class announcements
 */
export declare const listAnnouncements: (options?: Parameters<typeof customFetch>[1]) => Promise<Announcement[]>;
export declare const getListAnnouncementsQueryKey: () => readonly ["/api/announcements"];
export declare const getListAnnouncementsQueryOptions: <TData = Awaited<ReturnType<typeof listAnnouncements>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listAnnouncements>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAnnouncements>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type ListAnnouncementsQueryResult = NonNullable<Awaited<ReturnType<typeof listAnnouncements>>>;
export type ListAnnouncementsQueryError = ErrorType<void>;
export declare function useListAnnouncements<TData = Awaited<ReturnType<typeof listAnnouncements>>, TError = ErrorType<void>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof listAnnouncements>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof listAnnouncements>>, TError, Awaited<ReturnType<typeof listAnnouncements>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListAnnouncements<TData = Awaited<ReturnType<typeof listAnnouncements>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listAnnouncements>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof listAnnouncements>>, TError, Awaited<ReturnType<typeof listAnnouncements>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListAnnouncements<TData = Awaited<ReturnType<typeof listAnnouncements>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listAnnouncements>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getCreateAnnouncementUrl: () => string;
/**
 * @summary Publish an announcement
 */
export declare const createAnnouncement: (announcementInput: AnnouncementInput, options?: Parameters<typeof customFetch>[1]) => Promise<Announcement>;
export declare const getCreateAnnouncementMutationKey: () => readonly ["createAnnouncement"];
export declare const getCreateAnnouncementMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAnnouncement>>, TError, CreateAnnouncementMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createAnnouncement>>, TError, CreateAnnouncementMutationVariables, TContext>;
export type CreateAnnouncementMutationResult = NonNullable<Awaited<ReturnType<typeof createAnnouncement>>>;
export type CreateAnnouncementMutationBody = BodyType<AnnouncementInput>;
export type CreateAnnouncementMutationError = ErrorType<void>;
export type CreateAnnouncementMutationVariables = {
    data: BodyType<AnnouncementInput>;
};
/**
* @summary Publish an announcement
*/
export declare const useCreateAnnouncement: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAnnouncement>>, TError, CreateAnnouncementMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createAnnouncement>>, TError, CreateAnnouncementMutationVariables, TContext>;
export declare const getUpdateAnnouncementUrl: (id: number) => string;
/**
 * @summary Edit an announcement
 */
export declare const updateAnnouncement: (id: number, announcementUpdate: AnnouncementUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<Announcement>;
export declare const getUpdateAnnouncementMutationKey: () => readonly ["updateAnnouncement"];
export declare const getUpdateAnnouncementMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAnnouncement>>, TError, UpdateAnnouncementMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateAnnouncement>>, TError, UpdateAnnouncementMutationVariables, TContext>;
export type UpdateAnnouncementMutationResult = NonNullable<Awaited<ReturnType<typeof updateAnnouncement>>>;
export type UpdateAnnouncementMutationBody = BodyType<AnnouncementUpdate>;
export type UpdateAnnouncementMutationError = ErrorType<void>;
export type UpdateAnnouncementMutationVariables = {
    id: number;
    data: BodyType<AnnouncementUpdate>;
};
/**
* @summary Edit an announcement
*/
export declare const useUpdateAnnouncement: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAnnouncement>>, TError, UpdateAnnouncementMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateAnnouncement>>, TError, UpdateAnnouncementMutationVariables, TContext>;
export declare const getDeleteAnnouncementUrl: (id: number) => string;
/**
 * @summary Delete an announcement
 */
export declare const deleteAnnouncement: (id: number, options?: Parameters<typeof customFetch>[1]) => Promise<void>;
export declare const getDeleteAnnouncementMutationKey: () => readonly ["deleteAnnouncement"];
export declare const getDeleteAnnouncementMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAnnouncement>>, TError, DeleteAnnouncementMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteAnnouncement>>, TError, DeleteAnnouncementMutationVariables, TContext>;
export type DeleteAnnouncementMutationResult = NonNullable<Awaited<ReturnType<typeof deleteAnnouncement>>>;
export type DeleteAnnouncementMutationError = ErrorType<void>;
export type DeleteAnnouncementMutationVariables = {
    id: number;
};
/**
* @summary Delete an announcement
*/
export declare const useDeleteAnnouncement: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAnnouncement>>, TError, DeleteAnnouncementMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof deleteAnnouncement>>, TError, DeleteAnnouncementMutationVariables, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map