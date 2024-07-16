import type { Meta, StoryObj } from 'storybook-solidjs';
import { Tag } from '../../components/Tag';
import { AiOutlinePhone } from '../../components/icons';


// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
  title: 'components/Tag',
  component: Tag,
  tags: ['autodocs']
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Default: Story = {
  render: () => <Tag>Default</Tag>
}

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const AccentMediumExample: Story = {
  render: () => <div class="bg-white dark:bg-dark"><Tag color='accent' variant='medium'>amber medium</Tag></div>
};
export const ErrorMediumExample: Story = {
  render: () => <div class="bg-white dark:bg-dark"><Tag color='error' variant='medium'>amber medium</Tag></div>
};


export const InfoSmallExample: Story = {
  render: () => <div class="bg-white dark:bg-dark"><Tag color='info' variant='small'>amber medium</Tag></div>
};

export const OutlineSmallExample: Story = {
  render: () => <div class="bg-white dark:bg-dark"><Tag color='outline' variant='small'>emerald small</Tag></div>
};
export const PrimarySmallExample: Story = {
  render: () => <div class="bg-white dark:bg-dark"><Tag color='primary' variant='small'>amber small</Tag></div>
};
export const PrimarySmallExampleWithIconAndCopy: Story = {
  render: () => <div class="bg-white dark:bg-dark"><Tag color='primary' variant='small' copyFn={() => "0041 78 654 23 12"}>0041 78 654 23 12</Tag></div>
};
export const PrimaryExampleWithIconAndCopy: Story = {
  render: () => <div class="bg-white dark:bg-dark"><Tag iconFn={AiOutlinePhone} color='primary' variant='medium' copyFn={() => "0041 78 654 23 12"}>0041 78 654 23 12</Tag></div>
};
export const SecondarySmallExampleWithIconAndCopy: Story = {
  render: () => <Tag color='secondary' variant='small' copyFn={() => "0041 78 654 23 12"}>0041 78 654 23 12</Tag>
};
export const SecondaryExampleWithIconAndCopy: Story = {
  render: () => <Tag iconFn={AiOutlinePhone} color='secondary' variant='medium' copyFn={() => "0041 78 654 23 12"}>0041 78 654 23 12</Tag>
};

export const SuccessSmallExample: Story = {
  render: () => <div class="bg-white dark:bg-dark"><Tag color='success' variant='small'>sky small</Tag></div>
};

export const WarningSmallExample: Story = {
  render: () => <div class="bg-white dark:bg-dark"><Tag color='warning' variant='small'>zinc small</Tag></div>
};