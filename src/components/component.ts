type Component<TConfig, TComponent> = (
  root: JQuery,
  config: TConfig
) => TComponent;

export abstract class ClassComponent<TConfig = any> {
  constructor(root: JQuery, config: TConfig) {}
  public update(root: JQuery, config: TConfig): void {}
}

export function createComponentFromClass<
  TConfig,
  TComponent extends ClassComponent<TConfig>
>(componentType: {
  new (root: JQuery, config: TConfig): TComponent;
}): Component<TConfig, TComponent> {
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
