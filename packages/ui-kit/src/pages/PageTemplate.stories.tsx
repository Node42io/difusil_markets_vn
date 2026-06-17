import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "../components/Breadcrumb/Breadcrumb";
import { PageTemplate } from "./PageTemplate";

const meta = {
  title: "Pages/Template",
  component: PageTemplate,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PageTemplate>;

export default meta;
type Story = StoryObj<typeof PageTemplate>;

export const Default: Story = {};

/** Breadcrumb trail (and an optional `beforeTitle` row) above the page title. */
export const WithBreadcrumb: Story = {
  args: {
    breadcrumb: (
      <Breadcrumb
        items={[
          { label: "Market Analysis", href: "#" },
          { label: "Market Page" },
        ]}
      />
    ),
    title: "Market Page",
  },
};
