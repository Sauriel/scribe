import DOMHelper from "@/helper/DOMHelper";
import { Directive, DirectiveBinding } from "@vue/runtime-dom";

const updateComponent = function (element: HTMLElement, binding: DirectiveBinding) {
  element.innerHTML = DOMHelper.sanitize(binding.value);
};

export const SaveHtmlDirective: Directive<any, any> = {
  mounted: updateComponent,
  updated: updateComponent,
};
