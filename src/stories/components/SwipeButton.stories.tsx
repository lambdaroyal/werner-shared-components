import type { Meta, StoryObj } from 'storybook-solidjs';
import { SwipeButton } from '../../components/SwipeButton';



// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta: Meta = {
    title: 'Components/SwipeButton',
    component: SwipeButton,
    tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const SwipeButtonDemo: Story = {
    render: () => <div><SwipeButton /></div>
};