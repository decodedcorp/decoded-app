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
    empty: "No activity yet",
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
