import { Meta, StoryObj } from 'storybook-solidjs';
import { QuickLinkList } from '../../components/QuickLinkList';
import { FiBarChart, FiClipboard, FiSearch } from '../../components/icons';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta: Meta = {
    title: 'components/QuickLinkList',
    component: QuickLinkList,
    tags: ['autodocs']
}
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => {
        return (
            <QuickLinkList
                items={[
                    {
                        icon: <FiSearch class="size-6 text-blue-600" />,
                        title: 'Search Reports',
                        description: 'Find reports across all your data',
                        onClick: () => alert('Search clicked'),
                        iconClass: 'bg-blue-50 text-blue-700'
                    },
                    {
                        icon: <FiBarChart class="size-6 text-green-600" />,
                        title: 'Analytics',
                        description: 'View performance metrics',
                        onClick: () => alert('Analytics clicked'),
                        iconClass: 'bg-green-50 text-green-700'
                    },
                    {
                        icon: <FiClipboard class="size-6 text-amber-600" />,
                        title: 'Recent Documents',
                        description: 'Access your recently viewed documents',
                        onClick: () => alert('Documents clicked'),
                        iconClass: 'bg-amber-50 text-amber-700'
                    }
                ]}
            />
        );
    }
};

export const WithStats: Story = {
    render: () => {
        return (
            <QuickLinkList
                items={[
                    {
                        icon: <FiBarChart class="size-6 text-blue-600" />,
                        title: 'Sales Report',
                        description: 'Current quarter performance',
                        onClick: () => alert('Sales clicked'),
                        iconClass: 'bg-blue-50 text-blue-700',
                        children: <div class="mt-2 text-sm text-gray-700">Revenue up 15% from last quarter</div>
                    },
                    {
                        icon: <FiSearch class="size-6 text-green-600" />,
                        title: 'Customer Insights',
                        description: 'User engagement metrics',
                        onClick: () => alert('Insights clicked'),
                        iconClass: 'bg-green-50 text-green-700',
                        children: <div class="mt-2 text-sm text-gray-700">247 new customers this month</div>
                    }
                ]}
            />
        );
    }
};

