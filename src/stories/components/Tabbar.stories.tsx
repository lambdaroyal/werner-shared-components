import type { Meta, StoryObj } from 'storybook-solidjs';
import { AiOutlineShoppingCart, TbBuildingFactory2 } from '../../components/icons';
import Tabbar from '../../components/Tabbar';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
  title: 'components/Tabbar',
  component: Tabbar,
  tags: ['autodocs']
} satisfies Meta<typeof Tabbar>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Default: Story = {
  render: () => <div class="bg-white dark:bg-dark"><Tabbar tabs={[
    { name: "General", icon: AiOutlineShoppingCart, children: <div></div> },
    { name: "Pit Master", icon: TbBuildingFactory2, children: <div></div> }
  ]} />
  </div>
}