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
            other: "Other",
          },
        },
        source: {
          title: "What's the source of this image?",
          placeholder: "Enter source information",
        },
      },
    },
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
