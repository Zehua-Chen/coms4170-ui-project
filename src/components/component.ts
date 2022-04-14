type Component<TConfig, TElement, TComponent> = (
  root: JQuery<TElement>,
  config: TConfig
) => TComponent;

export abstract class ClassComponent<TConfig = any, TElement = HTMLElement> {
  constructor(public root: JQuery<TElement>, config: TConfig) {}
  public update(root: JQuery<TElement>, config: TConfig): void {}
}

export function createComponentFromClass<
  TConfig,
  TElement,
  TComponent extends ClassComponent<TConfig, TElement>
>(componentType: {
  new (root: JQuery<TElement>, config: TConfig): TComponent;
}): Component<TConfig, TElement, TComponent> {
  return (root, config): TComponent => {
    if (!root.prop("_component")) {
      const component = new componentType(root, config);
      root.prop("_component", component);

      return component;
    }

    const component = root.prop("_component") as TComponent;
    component.update(root, config);

    return component;
  };
}
