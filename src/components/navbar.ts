export interface NavbarConfiguration {
  /**
   * If set, the nav link with `innerText` equal to this string will be given
   * `.active` class
   */
  active?: string;
}

/**
 * Update navbar with a configuration
 * @param config the configuration
 * @returns the navbar
 */
export default function navbar(config: NavbarConfiguration): JQuery {
  const { active = "" } = config;
  const root = $("nav");
  const link = root.find(".nav-link").filter((i, element) => {
    return element.innerText === active;
  });

  link.addClass("active");
  link.addClass("fw-bold");

  return root;
}
