export const privacyPolicy = {
  title: "Privacy Policy",
  description:
    "DECODED ('the Company') establishes and discloses the following privacy policy to protect the personal information of data subjects and handle related inquiries or complaints promptly and smoothly in accordance with Article 30 of the Personal Information Protection Act.",
  sections: {
    purpose: {
      title: "1. Purpose of Processing Personal Information",
      content:
        "The Company processes personal information for the following purposes...",
      items: {
        service: {
          title: "Service Provision",
          list: [
            "Content provision, customized service provision, service usage analysis",
            "Identity verification, prevention of unauthorized use",
          ],
        },
        member: {
          title: "Member Management",
          list: [
            "Identity verification and personal identification for membership services",
            "Handling complaints and delivering notices",
          ],
        },
      },
    },
    retention: {
      title: "2. Processing and Retention Period of Personal Information",
      description: [
        "The Company processes and retains personal information within the period of retention and use of personal information in accordance with laws or agreed upon when collecting personal information from the data subject.",
        "The processing and retention periods for each type of personal information are as follows:",
      ],
      periods: {
        membership: {
          title: "Membership Registration and Management",
          duration: "Until membership withdrawal",
          exceptions: [
            "When investigation or inquiry is ongoing due to violation of relevant laws",
            "When debt relationships remain from service use",
          ],
        },
        serviceLog: {
          title: "Service Usage Records",
          duration: "3 years",
        },
        loginLog: {
          title: "Login Records",
          duration: "3 months",
        },
      },
    },
    items: {
      title: "3. Items of Personal Information Processed",
      required: {
        title: "Required Items",
        list: [
          "Email",
          "User Identifier (ID)",
          "Nickname (AKA)",
          "Service Usage Records",
          "Access Logs",
        ],
      },
    },
    thirdParty: {
      title: "4. Provision of Personal Information to Third Parties",
      content:
        "The Company processes personal information only within the scope specified in Article 1 (Purpose of Processing Personal Information)...",
    },
    outsourcing: {
      title: "5. Outsourcing of Personal Information Processing",
      content:
        "The Company currently does not outsource personal information processing tasks...",
    },
    rights: {
      title:
        "6. Rights and Obligations of Data Subjects and Legal Representatives and Their Exercise",
      content:
        "Data subjects may exercise their rights to view, correct, delete, or suspend processing of personal information at any time...",
    },
    security: {
      title: "7. Security Measures for Personal Information",
      measures: {
        management: {
          title: "Administrative Measures",
          list: [
            "Establishment and implementation of internal management plan",
            "Regular employee training",
          ],
        },
        technical: {
          title: "Technical Measures",
          list: [
            "Management of access rights to personal information processing systems",
            "Installation and operation of access control systems",
            "Encryption of unique identification information",
            "Installation and operation of security programs",
          ],
        },
        physical: {
          title: "Physical Measures",
          list: ["Access control to computer rooms and data storage rooms"],
        },
      },
    },
    cookies: {
      title:
        "8. Installation, Operation, and Rejection of Automatic Personal Information Collection Devices",
      description: [
        "The Company uses 'cookies' to store and retrieve usage information to provide individual customized services.",
        "Cookies are small pieces of information sent by the server (http) operating the website to the user's computer browser and may be stored on the users' PC hard disk.",
      ],
    },
    officer: {
      title: "9. Privacy Protection Officer",
      info: {
        name: "Decoded Team",
        position: "Privacy Protection Officer",
        contact: "privacy@decoded.style",
      },
    },
    changes: {
      title: "10. Changes to Privacy Policy",
      content: "This privacy policy is effective from January 1, 2024.",
    },
    additionalMeasures: {
      title: "11. Additional Security Measures for Personal Information",
      list: [
        "Establishment and implementation of internal management plan",
        "Encryption of personal information",
        "Technical measures against hacking",
        "Access restriction to personal information",
        "Storage and prevention of access log forgery/alteration",
        "Use of locking devices for document security",
        "Access control for unauthorized personnel",
      ],
    },
  },
} as const;
