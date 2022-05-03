export interface SidebarConfiguration {
  elements: app.OverviewItem[];
  /**
   * If set, the nav link with `innerText` equal to this string will be given
   * `.active` class
   */
  active?: string;
}

/**
 * Update sidebar with a configuration
 * @param config the configuration
 * @returns the sidebar
 */
export default function sidebar(
  config: SidebarConfiguration,
  link: (id: number) => string = () => "#!"
): JQuery {
  const { elements, active = "" } = config;

  const root = $("#sidebar");
  root.empty();

  root.append(
    elements.map((element) =>
      $("<a />")
        .addClass("fs-5")
        .addClass("list-group-item")
        .addClass(element.name === active ? "active" : "")
        .attr("href", link(element.id))
        .text(element.name)
    )
  );

  return root;
}
