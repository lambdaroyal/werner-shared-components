import { createSignal, For, Match, Show, Switch } from "solid-js";
import { I18n } from "../lib/i18n";
import { AiOutlineDelete, FiDownloadCloud } from "./icons";
import clsx from "clsx";
import { makeId } from "../lib/utils";
import { I18nTag } from "./I18nTag";

export interface Image {
  source: string;
  title: string;
  filename: string;
}

export interface ImageGridProps {
  carousel?: boolean
  images: Array<Image>;
  isEdit?: boolean;
  onDelete?: (image: Image) => void;
  downloadAllowed?: boolean
}

export const ImageGrid = (props: ImageGridProps) => {

  const DownloadButton = (p: { image: Image }) => {
    const downloadImage = (url: string, name: string) => async () => {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    return <a onClick={downloadImage(p.image.source, p.image.filename)} class="btn btn-sm">
      <FiDownloadCloud />
      <I18nTag>Download</I18nTag>
    </a>
  };


  // https://daisyui.com/components/carousel/#carousel-with-nextprev-buttons
  const Carousel = (p: { class?: string }) => {
    const [index, setIndex] = createSignal<number>(0);
    const leftButtonClick = () => {
      setIndex(Math.max(0, index() - 1));
      return false;
    };
    const rightButtonClick = () => setIndex(Math.min(props.images.length - 1, index() + 1));

    // width strategy: mobile first
    // we allow for full width on mobile

    const [actionsAvailable, setActionsAvailable] = createSignal<boolean>(false);
    return (<Show when={props.images[index()]}>
      <div class={clsx("w-full sm:w-96 flex scroll-snap", p.class)}>
        <div class="relative w-full group" onmouseenter={() => { setActionsAvailable(true) }} onmouseleave={() => { setActionsAvailable(false) }}>
          <img
            src={props.images[index()].source}
            class="w-full" />
          <div class="flex justify-between items-center absolute top-0 bottom-0 left-5 right-5">
            <Show when={props.images.length > 1}>
              <button class="btn btn-circle no-animation" onClick={leftButtonClick} // transform -translate-y-1/2
                style={`visibility: ${index() != 0 ? "initial" : "hidden"};`}>
                ❮
              </button>

              <button class="btn btn-circle no-animation" onClick={rightButtonClick}
                style={`visibility: ${index() < props.images.length - 1 ? "initial" : "hidden"};`}>
                ❯
              </button>
            </Show>

          </div>
          <Show when={actionsAvailable()}>
            <div class="flex justify-center items-center gap-2 absolute bottom-2 left-5 right-5">
              <Show when={props.downloadAllowed}>
                <DownloadButton image={props.images[index()]} />
              </Show>
              <Show when={props.onDelete}>
                <button class="btn btn-sm btn-warning">
                  <AiOutlineDelete />
                  <I18nTag>Delete</I18nTag>
                </button>
              </Show>

            </div>

          </Show>
        </div>
      </div>
    </Show>
    )
  }

  // https://tailwindui.com/components/application-ui/lists/grid-lists#component-d6b6c178a9f460d37c542870139e940e
  return <Carousel />
};
