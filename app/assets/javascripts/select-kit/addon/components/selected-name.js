import { computed, get, action } from "@ember/object";
import Component from "@ember/component";
import { makeArray } from "discourse-common/lib/helpers";
import UtilsMixin from "select-kit/mixins/utils";
import layout from "select-kit/templates/components/selected-name";

export default Component.extend(UtilsMixin, {
  tagName: "",
  layout,
  name: null,
  value: null,

  @action
  onSelectedNameClick() {
    if (this.selectKit.options.clearOnClick) {
      this.selectKit.deselect(this.item);
      return false;
    }
  },

  didReceiveAttrs() {
    this._super(...arguments);

    // we can't listen on `item.nameProperty` given it's variable
    this.setProperties({
      headerLabel: this.getProperty(this.item, "labelProperty"),
      headerTitle: this.getProperty(this.item, "titleProperty"),
      name: this.getName(this.item),
      value:
        this.item === this.selectKit.noneItem ? null : this.getValue(this.item)
    });
  },

  ariaLabel: computed("item", "sanitizedTitle", function() {
    return this._safeProperty("ariaLabel", this.item) || this.sanitizedTitle;
  }),

  // this might need a more advanced solution
  // but atm it's the only case we have to handle
  sanitizedTitle: computed("title", function() {
    return String(this.title).replace("&hellip;", "");
  }),

  title: computed("headerTitle", "item", function() {
    return (
      this.headerTitle ||
      this._safeProperty("title", this.item) ||
      this.name ||
      ""
    );
  }),

  label: computed("headerLabel", "title", "name", function() {
    return (
      this.headerLabel ||
      this._safeProperty("label", this.item) ||
      this.title ||
      this.name
    );
  }),

  icons: computed("item.{icon,icons}", function() {
    const icon = makeArray(this._safeProperty("icon", this.item));
    const icons = makeArray(this._safeProperty("icons", this.item));
    return icon.concat(icons).filter(Boolean);
  }),

  _safeProperty(name, content) {
    if (!content) {
      return null;
    }

    return get(content, name);
  }
});
