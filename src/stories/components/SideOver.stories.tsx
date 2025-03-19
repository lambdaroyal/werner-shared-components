import { createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';
import { SideOver } from '../../components/modal/SideOver';


// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta: Meta = {
    title: 'components/SideOver',
    component: SideOver,
    tags: ['autodocs']
}
export default meta;
type Story = StoryObj<typeof meta>;


export const Default: Story = {
    render: () => {
        const [visible, setVisible] = createSignal(false);
        return <>
            <button onclick={() => setVisible(true)}>Open SideOver</button>
            <SideOver title="SideOver" id="SideOver" visible={visible} setIsVisible={setVisible} children={<div>Hello</div>} />
        </>
    }
}

