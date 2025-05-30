import { Accessor, createSignal, JSX, onCleanup, onMount, Setter, Show } from "solid-js";
import { I18nTag } from "../I18nTag";
import clsx from 'clsx'
import { AiOutlineCloseCircle } from "../icons";
import { OverLay } from "./Overlay";
import { I18n } from "../..";


interface SideOverProps {
  //if true then small screen size is 66% and large side over is 100%
  big?: boolean
  visible: Accessor<boolean>
  setIsVisible: Setter<boolean>
  children: JSX.Element
  title: string;
  localizeTitle?: boolean;
  id: string;
}
// https://tailwindui.com/components/application-ui/overlays/slide-overs#component-166f09a503f2e34749daca3d7dc50525
export const SideOver = (props: SideOverProps) => {

  const sessionVarKey = `SideOver-${props["id"]}-config`;
  const getConfigJson = () => {
    const config = localStorage.getItem(sessionVarKey);
    if (config) {
      return JSON.parse(config);
    } else {
      return {};
    }
  };

  const configJson = getConfigJson();


  const [size, setSize] = createSignal<"big" | "small">(configJson.size || "big");

  const handleEscape = (e: KeyboardEvent) => {
    if (e.code === "Escape") {
      props.setIsVisible(false)
    }
  }
  onMount(() => {
    document.body.addEventListener("keyup", handleEscape);
  });
  onCleanup(() => {
    document.body.removeEventListener("keyup", handleEscape);
  });

  const saveSession = () => {
    localStorage.setItem(sessionVarKey, JSON.stringify({ ...configJson, size: size(), }));
  }

  const changeWidth = (size: "big" | "small") => {
    setSize(size);
    saveSession();
  };

  const SizeChangeButtonGroup = () => (
    <div class="flex items-center	gap-2 invisible lg:visible">
      <span class="text-nowrap">{size() == "big" ? I18n.localize("Large view") : I18n.localize("Small view")}</span>
      <input type="checkbox" class={clsx("toggle toggle-sm", size() == "big" ? "toggle-success" : undefined)}
        checked={size() == "big"}
        onclick={() => changeWidth(size() == "small" ? "big" : "small")}
        aria-checked="false"
      />
    </div>
  );

  const sideOverwidth = () => {
    return clsx("w-full lg", size() == "big" ? "lg:max-w-7xl 2xl:max-w-[60rem]" : "lg:max-w-2xl")
  }

  const renderSizeChangeButton = () => {
    return <SizeChangeButtonGroup />
  }

  return (
    <Show when={props.visible()}>
      <OverLay visible={true} />
      <div class="relative z-20" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
        {/*  Background backdrop, show/hide based on slide-over state.*/}
        <div class="fixed inset-0"></div>

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden disabled-overlay">
            <div class={`pointer-events-none fixed inset-y-0 right-0 flex`}>
              {/*
                Slide-over panel, show/hide based on slide-over state.

                Entering: "transform transition ease-in-out duration-500 sm:duration-700"
                  From: "translate-x-full"
                  To: "translate-x-0"
                Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
                  From: "translate-x-0"
                  To: "translate-x-full"
             */}
              <div class={clsx(sideOverwidth(), "pointer-events-auto w-screen")}>
                <div class="flex flex-col overflow-y-auto non-boundary py-6 shadow-xl" style={{ height: "100vh" }}>
                  <div class="px-4">
                    <div class="flex items-start justify-between">
                      <h2 class="text-lg font-medium" id="slide-over-title">
                        {props.localizeTitle ? <I18nTag>{props.title}</I18nTag> : props.title}
                      </h2>
                      <div class="ml-3 flex h-7 items-center gap-x-2">
                        {renderSizeChangeButton()}
                        <div role="button" class="flex items-center gap-x-2 cursor-pointer" onclick={() => props.setIsVisible(false)}>
                          <kbd class="kbd invisible lg:visible">ESC</kbd>
                          <AiOutlineCloseCircle aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="relative mt-6 flex-1 px-4">
                    {/*  Replace with your content*/}
                    <div class="absolute inset-0 px-4">
                      {props.children}
                    </div>
                    {/*  /End replace*/}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Show >
  );
};