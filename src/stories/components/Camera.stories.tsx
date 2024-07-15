import type { Meta, StoryObj } from 'storybook-solidjs';
import { Camera, CameraProps } from '../../components/Camera';



// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta: Meta<CameraProps> = {
    title: 'Components/Camera',
    component: Camera,
    tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;



export const Simple: Story = {
    args: {
        hideCamera: () => { }, onError: (e) => console.error(e), onSubmit: () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(undefined);
                }, 5000)
            });
        }
    }
};
