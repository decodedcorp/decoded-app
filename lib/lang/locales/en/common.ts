export const common = {
  actions: {
    next: "Next",
    prev: "Previous",
    submit: "Submit",
    cancel: "Cancel",
    confirm: "Confirm",
    complete: "Complete",
    more: "More",
    less: "Less",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    provide: "Provide",
    request: "Request",
    provideLink: "Provide Link",
    addItem: "Add Item",
    addLink: "Add Link",
    login: {
      google: "Continue with Google",
      facebook: "Continue with Facebook",
      apple: "Continue with Apple",
    },
    logout: "Disconnect",
  },
  placeHolder: {
    description: "Enter description",
    directInput: "Enter direct input",
  },
  status: {
    loading: "Loading",
    success: "Success",
    error: "Error",
    warning: "Warning",
    empty: "No items found",
    messages: {
      success: {
        request: {
          title: "Request Success",
          message: "Your request has been completed successfully.",
        },
        provide: {
          title: "Provide Success",
          message: "Your provision has been completed successfully.",
        },
        save: {
          title: "Save Success",
          message: "Successfully saved.",
        },
      },
      loading: {
        title: "Loading",
        message: "Please wait a moment.",
      },
      error: {
        default: {
          title: "Error Occurred",
          message: "An error occurred. Please try again.",
        },
        request: {
          title: "Request Failed",
          message: "Failed to process your request. Please try again.",
        },
        provide: {
          title: "Provide Failed",
          message: "Failed to process your provision. Please try again.",
        },
      },
      warning: {
        unsavedChanges: {
          title: "Unsaved Changes",
          message: "You have unsaved changes. Do you want to leave?",
        },
        delete: {
          title: "Confirm Delete",
          message: "Are you sure you want to delete?",
        },
        login: {
          title: "Login Required",
          message: "Login is required for this service.",
        },
      },
    },
  },
  validation: {
    required: "This field is required",
    invalid: "Invalid input",
    minLength: "Must be at least {{count}} characters",
    maxLength: "Must be less than {{count}} characters",
  },
  time: {
    now: "Just now",
    minutesAgo: "{{count}} minutes ago",
    hoursAgo: "{{count}} hours ago",
    daysAgo: "{{count}} days ago",
  },
  share: {
    title: "Share",
    copyLink: "Copy Link",
    copied: "Copied!",
  },
  errors: {
    dataFetchFailed: "Failed to fetch data",
    brandNotFound: "Brand information not found",
    loginRequired: "Login is required",
    unknownError: "An unknown error occurred. Please try again later.",
    invalidFileType: "Unsupported file type",
    fileSizeExceeded: "File size must be less than {{count}}MB",
    contextOptionFetchFailed: "Failed to fetch options",
    noItems: "No items found",
  },
  terminology: {
    request: "Request",
    provide: "Provide",
    trending: "Trending",
    exposureRate: "Exposure Rate",
    viewCount: "View Count",
  },
} as const;
