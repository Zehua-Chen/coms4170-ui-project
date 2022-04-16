export interface SidebarConfiguration {
  elements: string[];
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
export default function sidebar(config: SidebarConfiguration): JQuery {
  const { elements, active = "" } = config;

  const root = $("#sidebar");
  root.empty();

  root.append(
    elements.map((element) =>
      $("<a href='#' />")
        .addClass("fs-5")
        .addClass("sidebar-item")
        .addClass(element === active ? "active" : "")
        .text(element)
    )
  );

  return root;
}
