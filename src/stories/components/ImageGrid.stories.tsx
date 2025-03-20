import type { Meta, StoryObj } from 'storybook-solidjs';
import { Image, ImageGrid, ImageGridProps } from '../../components/ImageGrid';



// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta: Meta<ImageGridProps> = {
    title: 'Components/ImageGrid',
    component: ImageGrid,
    tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const OneImage: Story = {
    render: () => <div><ImageGrid images={[{ title: "", filename: "", source: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg" }]} /></div>
};

export const ManyImages: Story = {
    args: {
        images: [{
            title: "", filename: ""
            , source: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg"
        }, {
            title: "", filename: ""
            , source: "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg"
        }, {
            title: "", filename: ""
            , source: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg"
        }]
    }
};

export const ManyImagesWithDownload: Story = {
    args: {
        downloadAllowed: true, onDelete: (s: Image) => { }, images: [{
            title: "", filename: ""
            , source: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg"
        }, {
            title: "", filename: ""
            , source: "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg"
        }, {
            title: "", filename: ""
            , source: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg"
        }]
    },
    render: (args: ImageGridProps) => {
        return <div>
            <dialog id="my_modal_1" class="modal">
                <div class="modal-box">
                    <h3 class="text-lg font-bold">Hello!</h3>
                    <p class="py-4">Press ESC key or click the button below to close</p>
                    <div class="modal-action">
                        <form method="dialog">
                            <button class="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
            <ImageGrid downloadAllowed={true} onDelete={() => (document.getElementById('my_modal_1') as any)!.showModal()} images={[{
                title: "", filename: ""
                , source: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg"
            }, {
                title: "", filename: ""
                , source: "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg"
            }, {
                title: "", filename: ""
                , source: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg"
            }]} />
        </div>
    }
};
