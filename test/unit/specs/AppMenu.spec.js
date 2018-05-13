import { shallow } from '@vue/test-utils';
import AppMenu from '@>/components/app-menu/AppMenu';

describe('AppMenu.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(AppMenu, {
      stubs: ['router-link']
    });
  });

  it('has a root element with class menu', () => {
    expect(wrapper.is('.menu')).to.equal(true);
  });

  it('has enumeration', () => {
    expect(wrapper.contains('ul')).to.equal(true);
    expect(wrapper.contains('li')).to.equal(true);
  });
});
