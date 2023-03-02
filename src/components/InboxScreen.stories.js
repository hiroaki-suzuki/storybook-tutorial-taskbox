import InboxScreen from './InboxScreen';
import store from '../lib/store';
import { rest } from 'msw';
import { MockedState } from './TaskList.stories';
import { Provider } from 'react-redux';
import { fireEvent, waitFor, waitForElementToBeRemoved, within } from '@storybook/testing-library';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

const Template = () => <InboxScreen />;

export const Default = Template.bind({});
Default.parameters = {
  msw: {
    handlers: [
      rest.get('https://jsonplaceholder.typicode.com/todos?userId=1', (req, res, ctx) => {
        return res(ctx.json(MockedState.tasks));
      }),
    ],
  },
};

Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await waitForElementToBeRemoved(await canvas.findByTestId('loading'));
  await waitFor(async () => {
    fireEvent.click(await canvas.findByTestId('pinTask-1'));
    fireEvent.click(await canvas.findByTestId('pinTask-2'));
  });
};
