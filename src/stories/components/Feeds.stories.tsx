import { Meta, StoryObj } from 'storybook-solidjs';
import { FormLayout, FormVerticalSection } from '../../components/FormLayout';
import { Feeds } from '../../components/Feeds';
import { AiOutlinePrinter } from '../../components/icons';
import { createSignal } from 'solid-js';
import { DescriptionList } from '../../components/DescriptionList';
import { DescriptionListProps } from '../../components/DescriptionList';

// Define missing types
interface TCompletedTask {
    _type: 'drainage' | 'sewage_disposal' | string;
    id: string;
    created_at: string;
    [key: string]: any;
}

interface ITxSewageDisposal extends TCompletedTask {
    _type: 'sewage_disposal';
    volume: number;
    location: string;
}

// Mock components
const Switch = (props: { children: any }) => <>{props.children}</>;
const Match = (props: { when: boolean; children: any }) =>
    props.when ? <>{props.children}</> : null;

const TxDrainageView = (props: { item: TCompletedTask }) => (
    <div>
        <h3>Drainage Task</h3>
        <p>ID: {props.item.id}</p>
        <p>Created: {props.item.created_at}</p>
        <div class="rounded-md bg-white px-3 pt-2.5 pb-1.5 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
            <label for="name" class="block text-xs font-medium text-gray-900">Name</label>
            <input type="text" name="name" id="name" class="block w-full text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" placeholder="Jane Smith" />
        </div>

    </div>
);

const TxSewageDisposalView = (props: { item: ITxSewageDisposal }) => (
    <div>
        <h3>Sewage Disposal Task</h3>
        <p>ID: {props.item.id}</p>
        <p>Volume: {props.item.volume} liters</p>
        <p>Location: {props.item.location}</p>
    </div>
);

// Mock Notification service
const Notifications = {
    handleException: (err: Error) => {
        console.error('Error:', err);
    }
};

const meta: Meta = {
    title: 'components/Feeds',
    component: Feeds,
    tags: ['autodocs']
}
export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for the story
const mockCompletedTasks: TCompletedTask[] = [
    {
        _type: 'drainage',
        id: '12345',
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        location: 'North Basin',
        amount: 250
    },
    {
        _type: 'sewage_disposal',
        id: '67890',
        created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        location: 'South Port',
        volume: 500
    }
];

export const Default: Story = {
    render: () => {
        // Create signals for the mock functionality
        const [printingConfig, setPrintingConfig] = createSignal<any[]>([]);
        const [itemToPrint, setItemToPrint] = createSignal<TCompletedTask | null>(null);
        const modalDialogOpen = [false, (open: boolean) => console.log('Modal dialog:', open)];

        // Mock services
        const printingServices = {
            getLabelTypesAndPrintersForJobTxTypeAndDevice: (item: TCompletedTask, deviceId: string) => {
                console.log('Getting label types for', item, 'on device', deviceId);
                return Promise.resolve([
                    { labelType: 'Standard', printers: ['Printer1', 'Printer2'] }
                ]);
            }
        };

        const deviceContext = {
            deviceInfo: () => ({ 'device/id': 'DEVICE-001' })
        };

        const completedTasks = mockCompletedTasks;

        return (
            <FormLayout>
                <FormVerticalSection>
                    <Feeds<TCompletedTask>
                        actions={(item: TCompletedTask) => {
                            switch (item._type) {
                                case "drainage":
                                    return [{
                                        label: "Print drainage label",
                                        icon: <AiOutlinePrinter />,
                                        localize: true,
                                        onClick: (item: TCompletedTask) => {
                                            printingServices.getLabelTypesAndPrintersForJobTxTypeAndDevice(item, deviceContext.deviceInfo()["device/id"]!)
                                                .then((config: any) => {
                                                    setPrintingConfig(config);
                                                    setItemToPrint(item);
                                                    //modalDialogOpen[1](true);
                                                })
                                                .catch((err: Error) => {
                                                    Notifications.handleException(err);
                                                })
                                        }
                                    }]
                                case "sewage_disposal":
                                    return [{
                                        label: "Print sewage disposal label",
                                        icon: <AiOutlinePrinter />,
                                        localize: true,
                                        onClick: (item: TCompletedTask) => {
                                            printingServices.getLabelTypesAndPrintersForJobTxTypeAndDevice(item, deviceContext.deviceInfo()["device/id"]!)
                                                .then((config: any) => {

                                                    // check if we got any available labeltypes and printers, iff not throw error
                                                    if (config.length === 0) {
                                                        throw new Error("No label types configured for this task type");
                                                    }

                                                    setPrintingConfig(config);
                                                    setItemToPrint(item);
                                                    //modalDialogOpen[1](true);
                                                })
                                                .catch((err: Error) => {
                                                    Notifications.handleException(err);
                                                })
                                        }
                                    }]
                                default:
                                    return []
                            }

                        }}
                        items={() => completedTasks}
                        timeAgo={(item) => item.created_at!}
                        renderItem={(item) => <Switch>
                            <Match when={item._type === "drainage"}>
                                <TxDrainageView item={item} />
                            </Match>
                            <Match when={item._type === "sewage_disposal"}>
                                <TxSewageDisposalView item={item as ITxSewageDisposal} />
                            </Match>
                        </Switch>} />
                </FormVerticalSection>
            </FormLayout>
        );
    }
};


const sampleData = [
    {
        _type: "drainage",
        created_at: new Date().toISOString(),
        details: {
            key: 'Drainage Task',
            value: 'Details about the drainage task'
        }
    },
    {
        _type: "sewage_disposal",
        created_at: new Date().toISOString(),
        details: {
            key: 'Sewage Disposal Task',
            value: 'Details about the sewage disposal task'
        }
    }
];

const renderDescriptionList = (item: any) => {
    const descriptionListProps: DescriptionListProps = {
        xs: [
            { key: 'Type', value: item._type },
            { key: 'Created At', value: item.created_at },
            { key: 'Details', value: item.details.value }
        ]
    };
    return <div>
        <h3>Drainage Task</h3>
        <DescriptionList {...descriptionListProps} />
    </div>

};

export const CombinedFeeds: Story = {
    render: () => {
        return (
            <Feeds
                actions={(item) => {
                    switch (item._type) {
                        case "drainage":
                            return [{
                                label: "Print drainage label",
                                icon: <AiOutlinePrinter />,
                                localize: true,
                                onClick: (item) => {
                                    console.log("Printing drainage label for", item);
                                }
                            }];
                        case "sewage_disposal":
                            return [{
                                label: "Print sewage disposal label",
                                icon: <AiOutlinePrinter />,
                                localize: true,
                                onClick: (item) => {
                                    console.log("Printing sewage disposal label for", item);
                                }
                            }];
                        default:
                            return [];
                    }
                }}
                items={() => sampleData}
                timeAgo={(item) => item.created_at}
                renderItem={(item) => renderDescriptionList(item)}
            />
        );
    }
};
