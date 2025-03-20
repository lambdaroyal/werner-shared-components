import { Meta, StoryObj } from 'storybook-solidjs';
import { DescriptionList, DescriptionListProps } from '../../components/DescriptionList';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta: Meta = {
    title: 'components/DescriptionList',
    component: DescriptionList,
    tags: ['autodocs']
}
export default meta;
type Story = StoryObj<typeof meta>;

const sampleData: DescriptionListProps = {
    xs: [
        { key: 'Name', value: 'John Doe' },
        { key: 'Age', value: '30' },
        { key: 'Occupation', value: 'Software Engineer' },
        { key: 'Location', value: 'San Francisco' }
    ]
};

export const Default: Story = {
    render: () => {
        return (
            <DescriptionList xs={sampleData.xs} />
        );
    }
};

export const WithTranslations: Story = {
    render: () => {
        return (
            <DescriptionList
                xs={[
                    { key: 'Name', value: 'John Doe', translateKey: true, translateValue: true },
                    { key: 'Age', value: '30', translateKey: true, translateValue: false },
                    { key: 'Occupation', value: 'Software Engineer', translateKey: true, translateValue: true },
                    { key: 'Location', value: 'San Francisco', translateKey: true, translateValue: true }
                ]}
            />
        );
    }
};
