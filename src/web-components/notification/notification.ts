import type { Notification } from "@/definitions";
import { useNotificationStore } from "@/components/notification/useNotificationStore";

type NotificationEventName = 'read' | 'delete'
export type NotificationEventType = "cc-notification:read" | "cc-notification:delete";
export interface NotificationEventDetail {
    id: string;
}

export class NotificationEvent extends CustomEvent<NotificationEventDetail> {
    constructor(type: NotificationEventType, id: string) {
        super(type, { detail: { id }, bubbles: true, composed: true });
    }
}

declare global {
    interface HTMLElementEventMap {
        "cc-notification:read": NotificationEvent;
        "cc-notification:delete": NotificationEvent;
    }
}

class NotificationComponent extends HTMLDivElement {
    static observedAttributes = ["data-id", "data-title", "data-description", "data-read", "data-type"];
    #root;
    #id: string = '';
    #title: string = '';
    #description: string = '';
    #read: boolean = false;
    #type: string = '';

    #collapsed: boolean = true;

    constructor() {
        super();
        this.#root = this.attachShadow({ mode: "open" });
        this.#render();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'data-id') this.#id = newValue;
        if (name === 'data-title') this.#title = newValue;
        if (name === 'data-type') this.#type = newValue;
        if (name === 'data-description') this.#description = newValue;
        if (name === 'data-read') this.#read = (newValue === 'true');

        this.#update();
    }

    #markAsRead(): void {
        if (!this.#read) {
            this.#emit('read');
            this.#root.querySelector('.unread')?.classList.remove('unread');
            (this.#root.querySelector('[data-action="view"]') as HTMLButtonElement).innerHTML = '✅';
        }
        this.#collapsed = !this.#collapsed;
    }

    #emit(eventType: NotificationEventName): void {
        this.dispatchEvent(new NotificationEvent(('cc-notification:' + eventType) as NotificationEventType, this.#id as string));
    }

    #getCssNode(): HTMLStyleElement {
        const node = document.createElement('style');
        node.textContent = `
            .notification{
                .wrapper {
                    display: flex;
                    gap: 0.25rem;

                    .title {
                        flex-grow: 1;
                        border-radius: 5px;
                        padding: 0.25rem;
                    }

                    .buttonGroup {
                        display: flex;
                        gap: 0;
                        border-radius: 5px;
                        overflow: hidden;
                    }

                    button {
                        cursor: pointer;
                        background: #EEE;
                        border: none;
                        width:32px;
                        margin: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        transition: all 0.25s ease-in-out;

                        &:hover {
                            filter: brightness(80%);
                        }
                    }
                }

                .unread {
                    font-weight: bold;
                }

                .success {
                    background: #b9f8cf;
                    color: #00c951
                }

                .info {
                    background: #bedbff;
                    color: #2b7fff
                }

                .error {
                    background: #ffc9c9;
                    color: #fb2c36
                }

                .description {
                    padding: 0;
                    transition: all 0.25s ease-in-out;
                    overflow: hidden;
                    opacity: 0;
                    max-height: 0;
                }

                .description.visible {
                    padding: 0.5rem;
                    opacity: 1;
                    max-height: 40rem;
                }
            }
        `;

        return node;
    }

    #getHtmlNode(): HTMLDivElement {
        const notifNode = document.createElement('div');
        notifNode.className = 'notification';

        notifNode.innerHTML = `<div class="wrapper">
                <div class="title unread">
                    ${this.#title }
                </div>
                <div class="buttonGroup">
                    <button data-action="view">👁️‍🗨️</button>
                    <button data-action="delete">🗑️</button>
                </div>
            </div>
            <div class="description">
                ${this.#description}
            </div>`

        notifNode.querySelector('[data-action="view"]')?.addEventListener('click', () => {
            this.#markAsRead();
            const descriptionNode = notifNode.querySelector('.description') as HTMLDivElement;
            if (descriptionNode?.classList.contains('visible')) {
                descriptionNode.classList.remove('visible')
            } else {
                descriptionNode.classList.add('visible')
            }
        });

        notifNode.querySelector('[data-action="delete"]')?.addEventListener('click', () => {
            this.#emit('delete');
        });

        return notifNode;
    }

    #update() {
        const titleNode = this.#root.querySelector('.title') as HTMLDivElement;
        titleNode.innerHTML = '' + this.#title;
        if (this.#type) titleNode.classList.add(this.#type);
        if (titleNode.classList.contains('unread') && this.#read) {
            titleNode.classList.remove('unread')
        }

        const viewButton = this.#root.querySelector('[data-action="view"]') as HTMLButtonElement;
        viewButton.innerHTML = this.#read ? '✅' : '👁️‍🗨️'

        const descNode = this.#root.querySelector('.description') as HTMLDivElement;
        descNode.innerHTML = this.#description;
        if (this.#collapsed) {
            descNode.classList.remove('visible');
        } else {
            descNode.classList.add('visible');
        }
    }

    #render() {
        this.#root.innerHTML = '';
        this.#root.appendChild(this.#getCssNode());
        this.#root.appendChild(this.#getHtmlNode());
        this.#update();
    }
}

customElements.define("cc-notification", NotificationComponent, {extends: 'div'});

export default NotificationComponent;