export const mypage = {
  title: "My Page",
  tabs: {
    home: "Home",
    request: "Request",
    provide: "Provide",
    like: "Like",
    notification: "Notification",
  },
  home: {
    logout: "Login to view activity history",
    empty: "No activity yet",
    settings: "Edit Profile",
    activity: {
      points: "Points",
      activityCounts: "Activity Counts",
    },
    metricSections: {
      total: "Total",
      pending: "Pending",
      completed: "Completed",
      requests: "Requests",
      provides: "Provides",
    },
    points: {
      title: "Points",
      earned: "Points Earned",
      used: "Points Used",
      history: "Points History",
    },
    contributions: {
      title: "Contributions",
      requests: "Requests",
      offers: "Offers",
      accuracy: "Accuracy",
    },
  },
  request: {
    empty: "No requested items yet",
    status: {
      pending: "Pending",
      inProgress: "In Progress",
      completed: "Completed",
      rejected: "Rejected",
    },
    filter: {
      all: "All",
      pending: "Pending",
      inProgress: "In Progress",
      completed: "Completed",
    },
  },
  provide: {
    empty: "No provided links yet",
    status: {
      active: "Active",
      inactive: "Inactive",
      expired: "Expired",
    },
  },
  like: {
    empty: "No liked items yet",
    categories: {
      all: "All",
      items: "Items",
      images: "Images",
    },
  },
  notification: {
    messages: {
      item_provided: "Item Provided",
      point_received: "Point Received",
      system_notice: "System Notice",
      request_approved: "Request Approved",
    },
    profile: {
      title: "Profile Settings",
      name: "Name",
      bio: "Bio",
      image: "Profile Image",
    },
    account: {
      title: "Account Settings",
      email: "Email",
      password: "Password",
      delete: "Delete Account",
    },
    notification: {
      title: "Notification Settings",
      request: "Request Notifications",
      offer: "Offer Notifications",
      marketing: "Marketing Notifications",
    },
  },
} as const;
