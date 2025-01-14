"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils/style";

const Tabs = TabsPrimitive.Root;
const TabsList = TabsPrimitive.List;
const TabsTrigger = TabsPrimitive.Trigger;
const TabsContent = TabsPrimitive.Content;

const StyledTabsList = React.forwardRef<
  React.ElementRef<typeof TabsList>,
  React.ComponentPropsWithoutRef<typeof TabsList>
>(({ className, ...props }, ref) => (
  <TabsList ref={ref} className={cn("inline-flex", className)} {...props} />
));
StyledTabsList.displayName = "TabsList";

const StyledTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsTrigger>,
  React.ComponentPropsWithoutRef<typeof TabsTrigger>
>(({ className, ...props }, ref) => (
  <TabsTrigger
    ref={ref}
    className={cn("inline-flex items-center justify-center", className)}
    {...props}
  />
));
StyledTabsTrigger.displayName = "TabsTrigger";

const StyledTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsContent>,
  React.ComponentPropsWithoutRef<typeof TabsContent>
>(({ className, ...props }, ref) => (
  <TabsContent ref={ref} className={cn("mt-2", className)} {...props} />
));
StyledTabsContent.displayName = "TabsContent";

export {
  Tabs,
  StyledTabsList as TabsList,
  StyledTabsTrigger as TabsTrigger,
  StyledTabsContent as TabsContent,
};
