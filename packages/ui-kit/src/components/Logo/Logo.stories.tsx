import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./Logo";

const meta: Meta<typeof Logo> = {
  title: "Components/Logo",
  component: Logo,
  tags: ["autodocs"],
  args: {
    style: { width: 240, height: "auto" },
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {};

export const OnDarkBackground: Story = {
  parameters: { backgrounds: { default: "page" } },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: 32, background: "var(--color-page)" }}>
        <Story />
      </div>
    ),
  ],
};

export const CustomColor: Story = {
  args: {
    style: { width: 240, height: "auto", color: "var(--primary-1050)" },
  },
};
