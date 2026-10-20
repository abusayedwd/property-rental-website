import { apiSlice } from "../../api/apiSlice";

const notifications = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // { items, unreadCount }
        getNotifications: builder.query({
            query: () => `/notifications?limit=30`,
            providesTags: [{ type: "Notification", id: "LIST" }],
        }),
        markAllNotificationsRead: builder.mutation({
            query: () => ({ url: `/notifications/read-all`, method: "PATCH" }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    notifications.util.updateQueryData("getNotifications", undefined, (draft) => {
                        const data = draft?.data?.attributes;
                        if (!data) return;
                        data.items.forEach((n) => (n.isRead = true));
                        data.unreadCount = 0;
                    })
                );
                queryFulfilled.catch(patch.undo);
            },
        }),
        markNotificationRead: builder.mutation({
            query: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    notifications.util.updateQueryData("getNotifications", undefined, (draft) => {
                        const data = draft?.data?.attributes;
                        const item = data?.items.find((n) => n.id === id);
                        if (item && !item.isRead) {
                            item.isRead = true;
                            data.unreadCount = Math.max(0, data.unreadCount - 1);
                        }
                    })
                );
                queryFulfilled.catch(patch.undo);
            },
        }),
    }),
});

export const { useGetNotificationsQuery, useMarkAllNotificationsReadMutation, useMarkNotificationReadMutation } = notifications;
export default notifications;
