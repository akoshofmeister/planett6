import { shallow } from '@vue/test-utils';
import HelloWorld from 'src/components/HelloWorld';

describe('HelloWorld.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(HelloWorld, {
      stubs: ['router-link']
    });
  });

  it('should render correct contents', () => {
    expect(wrapper.find('.hello h1').text())
      .to.equal('Welcome to Your Vue.js App');
  });

  it('should have initial count of 0', () => {
    expect(wrapper.vm.count).to.equal(0);
  });

  describe('increment', () => {
    it('should increment the count', () => {
      wrapper.vm.increment();
      expect(wrapper.vm.count).to.equal(1);
    });

    it('should show the incremented count after clicking the button', () => {
      const button = wrapper.find('button');
      button.trigger('click');
      expect(wrapper.find('.hello .counter').text()).to.contain('1');
    });
  });
});
