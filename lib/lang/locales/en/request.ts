export const request = {
  steps: {
    messages: {
      upload: "Upload an image",
      marker: "Select items",
      context: "Provide more context",
    },
    upload: {
      title: "Upload Image",
      description: "Upload an image containing items you want to find",
      guide: {
        required: {
          title: "Required",
          description:
            "Please upload an image containing the items you want to find",
        },
        help: {
          title: "Help",
          items: [
            "Maximum file size: 5MB",
            "Supported formats: jpg, jpeg, png",
          ],
        },
      },
    },
    marker: {
      title: "Select Items",
      description: "Click on the items you want to find",
      guide: {
        required: {
          title: "Required",
          description: [
            "Click on the image to mark item locations",
            "At least one item must be selected",
          ],
        },
        help: {
          title: "Help",
          items: [
            "Click X button on marker to delete",
            "Item descriptions help provide better information",
          ],
        },
      },
      marker: {
        title: "Selected Items",
        placeholder: "Enter description",
        list: {
          title: "Display items on the image",
        },
      },
    },
    context: {
      title: "Additional Information",
      description: "Provide more context about the image",
      guide: {
        required: {
          title: "Required",
          description:
            "Please provide additional information to help provide better context for the image",
        },
        optional: {
          title: "Optional",
          description:
            "Additional information helps provide better context for the image",
        },
      },
      questions: {
        location: {
          title: "Where was this photo taken?",
          options: {
            airport: "Airport",
            concert: "Concert",
            event: "Event",
            casual: "Casual",
            studio: "Studio",
          },
        },
        source: {
          title: "What's the source of this image?",
          placeholder: "Enter source information",
          options: {
            sns: "SNS (e.g. Instagram, Twitter)",
            personal: "Personal",
            news: "News or Blog",
          },
        },
      },
    },
  },
  modal: {
    confirmClose: {
      title: "Cancel Operation",
      message: "Your current progress will be lost. Are you sure you want to close?",
      confirm: "Close",
      cancel: "Continue Working"
    },
    confirmExitCropper: {
      title: "Cancel Editing",
      message: "Your edits will not be saved. Are you sure you want to cancel editing?",
      confirm: "Cancel Editing",
      cancel: "Continue Editing"
    }
  },
  validation: {
    login: "Login required",
    image: "Please upload an image",
    markers: "Please select at least one item",
    submit: {
      success: "Request submitted successfully",
      error: "Failed to submit request",
      unknown: "An unknown error occurred",
    },
  },
} as const;
