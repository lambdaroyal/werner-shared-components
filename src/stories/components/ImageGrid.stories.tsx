import type { Meta, StoryObj } from 'storybook-solidjs';
import { ImageGrid } from '../../components/ImageGrid';



// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
    title: 'Components/ImageGrid',
    component: ImageGrid,
    tags: ['autodocs'],
} satisfies Meta<typeof ImageGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const OneImage: Story = {
    render: () => <div><ImageGrid images={[{ title: "", filename: "", source: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg" }]} /></div>
};

export const ManyImages: Story = {
    render: () => <div class="tailwind"><ImageGrid images={[{
        title: "", filename: ""
        , source: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg"
    }, {
        title: "", filename: ""
        , source: "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg"
    }, {
        title: "", filename: ""
        , source: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg"
    }]} /></div>
};

export const ManyImagesWithDownload: Story = {
    render: () => <div class="tailwind"><ImageGrid downloadAllowed={true} onDelete={(s) => { }} images={[{
        title: "", filename: ""
        , source: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg"
    }, {
        title: "", filename: ""
        , source: "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg"
    }, {
        title: "", filename: ""
        , source: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg"
    }]} /></div>
};
