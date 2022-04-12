type FunctionalAPI<TConfig> = (
  root: JQuery,
  config: TConfig
) => Component<TConfig>;

type ComponentType<TConfig> = { new (): Component<TConfig> };

export default abstract class Component<TConfig = any> {
  static createFunctionalAPI<TConfig>(
    componentType: ComponentType<TConfig>
  ): FunctionalAPI<TConfig> {
    return (root, config) => {
      if (!root.prop("_component")) {
        root.prop("_component", new componentType());
      }

      const component = root.prop("_component") as Component<TConfig>;

      if (!root.prop("_created")) {
        component.attach(root, config);
        root.prop("_created", true);

        return component;
      }

      component.update(root, config);

      return component;
    };
  }

  protected abstract attach(root: JQuery, config: TConfig): void;

  protected update(root: JQuery, config: TConfig): void {}
}
