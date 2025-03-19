import { Accessor, createSignal, JSX, onCleanup, onMount, Setter, Show } from "solid-js";
import { I18nTag } from "../I18nTag";
import clsx from 'clsx'
import { AiOutlineCloseCircle } from "../icons";
import { OverLay } from "./Overlay";


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


  const [size, setSize] = createSignal(configJson.size || "big");

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

  const changeWidth = (size: string) => {
    setSize(size);
    saveSession();
  };

  const SizeChangeButtonGroup = () => (
    <div class="flex items-center	gap-2 invisible lg:visible">
      <span class="text-nowrap"><I18nTag key={size() == "small" ? "Small view" : "Large view"} /></span>
      <input type="checkbox" class={clsx("toggle toggle-sm", size() == "big" ? "toggle-success" : undefined)}
        checked={size() == "big"}
        onclick={() => changeWidth(size() == "small" ? "large" : "small")}
        aria-checked="false"
      />
    </div>
  );

  const sideOverwidth = () => {
    if (size() === "small") {
      return props.big ? "lg:max-w-7xl" : "lg:max-w-md"
    } else {
      return props.big ? "lg:max-w-full" : "lg:max-w-5xl"
    }
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
            <div class={`pointer-events-none fixed inset-y-0 right-0 flex max-w-full`}>
              {/*
                Slide-over panel, show/hide based on slide-over state.

                Entering: "transform transition ease-in-out duration-500 sm:duration-700"
                  From: "translate-x-full"
                  To: "translate-x-0"
                Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
                  From: "translate-x-0"
                  To: "translate-x-full"
             */}
              <div class={clsx(sideOverwidth(), "pointer-events-auto w-screen max-w-full")}>
                <div class="flex flex-col overflow-y-auto non-boundary py-6 shadow-xl" style={{ height: "100vh" }}>
                  <div class="px-4">
                    <div class="flex items-start justify-between">
                      <h2 class="text-lg font-medium" id="slide-over-title">
                        {props.localizeTitle ? <I18nTag>{props.title}</I18nTag> : props.title}
                      </h2>
                      <div class="ml-3 flex h-7 items-center gap-x-2">
                        {renderSizeChangeButton()}
                        <button
                          type="button"
                          class="flex items-center rounded-md text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                          onclick={() => props.setIsVisible(false)}>
                          <span class="sr-only"><I18nTag key="Close panel" /></span>
                          <AiOutlineCloseCircle aria-hidden="true" />
                        </button>
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