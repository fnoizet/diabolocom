import type { Notification } from "@/definitions";
import "./notification";
import customNotificationStore from "./customNotificationStore";
import type { CustomNotificationStore } from "./customNotificationStore";
import type { NotificationEvent } from "./notification";

class NotificationWidget extends HTMLElement {
    static observedAttributes = ["data-namespace"];
    #root;
    #namespace: string = '';
    #store: CustomNotificationStore;

    constructor() {
        super();

        this.#namespace = this.dataset['namespace'] as string;

        this.#root = this.attachShadow({ mode: "open" });
        this.#store = customNotificationStore;
        this.#render();
    }

    connectedCallback() {
        this.#store.addListener(() => {
            this.#update();
        });
    }

    #getCssNode(): HTMLStyleElement {
        const node = document.createElement('style');
        node.textContent = `
            .notification-widget{
                position: relative;
                background: #FFF;
                padding: 0 20px 20px;
                border-radius: 10px;
                box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px -1px rgba(0,0,0,0.1);

                .header {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 0.5rem;

                    h2 {
                        font-size: 1.125rem;
                        margin: 0.5rem;
                        font-weight: bold;
                        text-transform: uppercase;
                    }

                    .p-badge {
                        display: inline-flex;
                        border-radius: 50%;
                        align-items: center;
                        justify-content: center;
                        padding: 0;
                        background: #10b981;
                        color: #FFF;
                        font-size: 0.75rem;
                        font-weight: 700;
                        min-width: 1.5rem;
                        height: 1.5rem;
                    }
                }

                .buttonGroup {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 0.25rem;
                    gap: 0.25rem;

                    button {
                        aspect-ratio: 1;
                        border-radius: 5px;
                        border: none;
                        cursor: pointer;
                        transition: all 0.25s ease-in-out;

                        &:hover {
                            filter: brightness(80%);
                        }
                    }
                }

                .form {
                    position: absolute;
                    z-index: 10;
                    left: 20px;
                    right: 20px;
                    padding: 0px;
                    background: #FFF;
                    border-radius: 5px;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3);

                    transition: all 0.25s ease-in-out;
                    opacity: 0;
                    max-height: 0;
                    overflow: hidden;

                    form {
                        display: flex;
                        flex-direction: column;
                        gap: 0.25rem;

                        label {
                            font-weight: 500;
                        }

                        button {
                            border: none;
                            color: #FFF;
                            font-weight: 500;
                            background: #10B981;
                            padding: 5px;
                            border-radius: 5px;
                            cursor: pointer;

                            &:hover {
                                filter: brightness(80%);
                            }
                        }
                    }
                }

                .form.visible {
                    opacity: 1;
                    max-height: 40rem;
                    padding: 10px;
                }

                .list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
            }
        `;

        return node;
    }

    #update(): void {
        const badgeNode = this.#root.querySelector('.p-badge');
        if (badgeNode) {
            badgeNode.innerHTML = this.#store.getUnreadCount(this.#namespace) + '';
        }

        const listNode = this.#root.querySelector('.list');
        if (listNode) {
            const storeNotifications = this.#store.getNotificationsByNamespace(this.#namespace);
            const presentNotifications = listNode.querySelectorAll('div');

            presentNotifications.forEach(notifNode => {
                const notif = storeNotifications.find(n => n.id === notifNode.dataset.id);
                if (!notif) {
                    notifNode.remove();
                } else {
                    notifNode.setAttribute('data-read', notif.read ? "true" : "false");
                }
            });

            storeNotifications.forEach(n => {
                if (listNode.querySelector(`[data-id="${n.id}"]`)) return ;

                const notifNode = document.createElement('div', { is: 'cc-notification' });
                notifNode.setAttribute('data-id', n.id);
                notifNode.setAttribute('data-title', n.title);
                notifNode.setAttribute('data-description', n.description);
                notifNode.setAttribute('data-type', n.type);
                notifNode.setAttribute('data-read', n.read ? "true" : "false");

                notifNode.addEventListener('cc-notification:read', (e: NotificationEvent) => this.#store.markAsRead(e.detail.id));
                notifNode.addEventListener('cc-notification:delete', (e: NotificationEvent) => this.#store.deleteNotification(e.detail.id));

                listNode.appendChild(notifNode);
            })
        }
    }

    #getHtmlNode(): HTMLDivElement {
        const node = document.createElement('div');
        node.className = 'notification-widget';

        const notifications = this.#store.getNotificationsByNamespace(this.#namespace) as Notification[];

        node.innerHTML = `
            <div class="header">
                <h2>${this.#namespace}</h2>
                <div class="p-badge">${notifications.length}</div>
            </div>
            <div class="buttonGroup">
                <button data-cy="add-success" data-type="success">✅</button>
                <button data-cy="add-info" data-type="info">ℹ️</button>
                <button data-cy="add-error" data-type="error">⛔</button>
                <button data-cy="add" data-type="form">➕</button>
            </div>
            <div class="form">
                <form>
                    <label>Title</label>
                    <input type="text" name="title" placeholder="Title">
                    <label>Type</label>
                    <select name="type">
                        <option value="success">success</option>
                        <option value="info">info</option>
                        <option value="error">error</option>
                    </select>
                    <label>Description</label>
                    <textarea name="description" placeholder="Description"></textarea>
                    <button data-cy="submit">Submit</button>
                </form>
            </div>
            <div class="list"></div>
        `;

        node.querySelectorAll('.buttonGroup button:not([data-type="form"])').forEach(b => {
            b.addEventListener('click',
                () => this.#newNotif(b.getAttribute('data-type') as 'success' | 'info' | 'error')
            )
        });

        node.querySelector('.buttonGroup button[data-type="form"]')?.addEventListener('click', () => {
            this.#toggleForm();
        })

        const form = node.querySelector('form') as HTMLFormElement;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(form));
            if (formData.title && form.description) {
                this.#store.addNotification({
                    title: formData.title.toString(),
                    description: formData.description.toString(),
                    type: formData.type.toString() as ('success' | 'info' | 'error'),
                    namespace: this.#namespace
                });
                this.#toggleForm();
                form.reset()
            } else {
                console.error('Form is not valid');
            }
        });

        return node;
    }

    #toggleForm() {
        const formWrapper = this.#root.querySelector('.form');
        if (formWrapper?.classList.contains('visible')) {
            formWrapper?.classList.remove('visible')
        } else {
            formWrapper?.classList.add('visible')
        }
    }

    #newNotif(type: 'success' | 'info' | 'error') {
        const newNotif = {
            title: 'New '+type,
            description: 'A new ' + type + ' happened at ' + (new Date()).toLocaleDateString(),
            type,
            namespace: this.#namespace
        };

        this.#store.addNotification(newNotif);
    }

    #render() {
        this.#root.innerHTML = '';
        this.#root.appendChild(this.#getCssNode());
        this.#root.appendChild(this.#getHtmlNode());
        this.#update();
    }
}

customElements.define("cc-notification-widget", NotificationWidget);

export default NotificationWidget;