type Component<TConfig, TComponent> = (
  root: JQuery,
  config: TConfig
) => TComponent;

export abstract class ClassComponent<TConfig = any> {
  public abstract attach(root: JQuery, config: TConfig): void;
  public update(root: JQuery, config: TConfig): void {}
}

export function createComponentFromClass<
  TConfig,
  TComponent extends ClassComponent<TConfig>
>(componentType: { new (): TComponent }): Component<TConfig, TComponent> {
  return (root, config): TComponent => {
    if (!root.prop("_component")) {
      root.prop("_component", new componentType());
    }

    const component = root.prop("_component") as TComponent;

    if (!root.prop("_created")) {
      component.attach(root, config);
      root.prop("_created", true);

      return component;
    }

    component.update(root, config);

    return component;
  };
}
