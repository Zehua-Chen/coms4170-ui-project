type Component<TConfig, TComponent = ClassComponent<TConfig>> = (
  root: JQuery,
  config: TConfig
) => TComponent;

type ClassComponentType<TConfig> = { new (): ClassComponent<TConfig> };

export abstract class ClassComponent<TConfig = any> {
  public abstract attach(root: JQuery, config: TConfig): void;
  public update(root: JQuery, config: TConfig): void {}
}

export function createComponentFromClass<TConfig>(
  componentType: ClassComponentType<TConfig>
): Component<TConfig> {
  return (root, config) => {
    if (!root.prop("_component")) {
      root.prop("_component", new componentType());
    }

    const component = root.prop("_component") as ClassComponent<TConfig>;

    if (!root.prop("_created")) {
      component.attach(root, config);
      root.prop("_created", true);

      return component;
    }

    component.update(root, config);

    return component;
  };
}
