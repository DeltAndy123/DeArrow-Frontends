import {$$} from "./elements";

export const list: CustomType =  {
  default: [] as string[],
  toNode(): HTMLElement {
    // Create a list of text inputs and a button to add more
    const { settings: field, id } = this;
    const values = this.value as string[];
    const container = $$(`div#${this.configId}_${id}_var.config_var`, {
      title: field.title
    }, [
      $$(`label#${this.configId}_${id}_field_label.field_label`, field.label),
    ]);
    values.forEach((item) => {
      const input = $$<"input">("input.list-item", {
        type: "text",
        value: item
      })
      const inputContainer = $$("span.input-container",
        [
            input,
            $$("button.list-remove", {
              listeners: {
                click: () => {
                  if (container.children.length <= 3) input.value = "";
                  else inputContainer.remove();
                }
              }
            }, $$("i.icon.ion-ios-remove-circle-outline"))
        ]
      );
      container.appendChild(inputContainer);
    })
    const addButton = $$<"button">("button.list-add", {
      listeners: {
        click: () => {
          const input = $$<"input">("input.list-item", { type: "text" });
          const inputContainer = $$("span.input-container",
              [
                input,
                $$("button.list-remove", {
                  listeners: {
                    click: () => {
                      if (container.children.length <= 3) input.value = "";
                      else inputContainer.remove();
                    }
                  }
                }, $$("i.icon.ion-ios-remove-circle-outline"))
              ]
          )
          container.insertBefore(inputContainer, addButton);
        }
      }
    }, $$("i.icon.ion-ios-add-circle-outline"));

    container.appendChild(addButton);
    return container;
  },
  toValue(): string[] {
    const { wrapper } = this;
    if (!wrapper) return [];
    const inputs = [...wrapper.querySelectorAll("input")];
    return inputs.map((input) => input.value);
  },
  reset() {
    const { wrapper, value } = this;
    if (!wrapper) return;
    if (!Array.isArray(value)) throw new Error("Value is not an array");
    if (!Array.isArray(this.settings.default)) throw new Error("Default is not an array");
    const inputs = [...wrapper.querySelectorAll("span.input-container")];
    inputs.forEach((input) => input.remove());
    const addButton = wrapper.querySelector("button.list-add");
    this.settings.default?.forEach((item) => {
      const input = $$<"input">("input.list-item", {
        type: "text",
        value: item.toString()
      })
      const inputContainer = $$("span.input-container",
        [
            input,
            $$("button.list-remove", {
              listeners: {
                click: () => {
                  if (wrapper.children.length <= 3) input.value = "";
                  else inputContainer.remove();
                }
              }
            }, $$("i.icon.ion-ios-remove-circle-outline"))
        ]
      );
      wrapper.insertBefore(inputContainer, addButton);
    })
  }
}