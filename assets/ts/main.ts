/*!
*   Hugo Theme Stack
*
*/
import StackGallery from "ts/gallery";
import { getColor } from 'ts/color';
import menu from 'ts/menu';
import createElement from 'ts/createElement';
import StackColorScheme from 'ts/colorScheme';
import { setupScrollspy } from 'ts/scrollspy';
import { setupSmoothAnchors } from "ts/smoothAnchors";

let Stack = {
    init: () => {
        /**
         * Bind menu event
         */
        menu();

        const articleContent = document.querySelector('.article-content') as HTMLElement;
        if (articleContent) {
            new StackGallery(articleContent);
            setupSmoothAnchors();
            setupScrollspy();
        }

        /**
         * Initialize copy as markdown functionality
         */
        Stack.initCopyAsMarkdown();

        /**
         * Add linear gradient background to tile style article
         */
        const articleTile = document.querySelector('.article-list--tile');
        if (articleTile) {
            let observer = new IntersectionObserver(async (entries, observer) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    observer.unobserve(entry.target);

                    const articles = entry.target.querySelectorAll('article.has-image');
                    articles.forEach(async articles => {
                        const image = articles.querySelector('img'),
                            imageURL = image.src,
                            key = image.getAttribute('data-key'),
                            hash = image.getAttribute('data-hash'),
                            articleDetails: HTMLDivElement = articles.querySelector('.article-details');

                        const colors = await getColor(key, hash, imageURL);

                        articleDetails.style.background = `
                        linear-gradient(0deg, 
                            rgba(${colors.DarkMuted.rgb[0]}, ${colors.DarkMuted.rgb[1]}, ${colors.DarkMuted.rgb[2]}, 0.5) 0%, 
                            rgba(${colors.Vibrant.rgb[0]}, ${colors.Vibrant.rgb[1]}, ${colors.Vibrant.rgb[2]}, 0.75) 100%)`;
                    })
                })
            });

            observer.observe(articleTile)
        }


        /**
         * Add copy button to code block
        */
        const highlights = document.querySelectorAll('.article-content div.highlight');
        const copyText = `Copy`,
            copiedText = `Copied!`;

        highlights.forEach(highlight => {
            const copyButton = document.createElement('button');
            copyButton.innerHTML = copyText;
            copyButton.classList.add('copyCodeButton');
            highlight.appendChild(copyButton);

            const codeBlock = highlight.querySelector('code[data-lang]');
            if (!codeBlock) return;

            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(codeBlock.textContent)
                    .then(() => {
                        copyButton.textContent = copiedText;

                        setTimeout(() => {
                            copyButton.textContent = copyText;
                        }, 1000);
                    })
                    .catch(err => {
                        alert(err)
                        console.log('Something went wrong', err);
                    });
            });
        });

        new StackColorScheme(document.getElementById('dark-mode-toggle'));
    },

    initCopyAsMarkdown: () => {
        const copyButtons = document.querySelectorAll('.copy-md-button');
        
        // Check for llms.txt format first, then fallback to markdown
        let llmsLink = document.querySelector('link[type="text/plain"]') as HTMLLinkElement;
        const markdownLink = document.querySelector('link[type="text/markdown"]') as HTMLLinkElement;
        
        // If no plain text link, try to construct llms.txt URL
        if (!llmsLink && markdownLink) {
            const currentUrl = new URL(window.location.href);
            const llmsUrl = currentUrl.pathname.endsWith('/') 
                ? currentUrl.pathname + 'llms.txt'
                : currentUrl.pathname + '/llms.txt';
            llmsLink = { href: llmsUrl } as HTMLLinkElement;
        }
        
        const preferredLink = llmsLink || markdownLink;
        if (preferredLink) {
            document.body.classList.add('has-markdown');
        }
        
        copyButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                
                try {
                    const response = await fetch(preferredLink.href);
                    const content = await response.text();
                    await navigator.clipboard.writeText(content);
                    
                    // Show feedback
                    const span = button.querySelector('span') as HTMLElement;
                    const originalText = span.textContent;
                    span.textContent = 'Copied!';
                    
                    setTimeout(() => {
                        span.textContent = originalText;
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy content:', err);
                    alert('Failed to copy content. Please try again.');
                }
            });
        });
    }
}

window.addEventListener('load', () => {
    setTimeout(function () {
        Stack.init();
    }, 0);
})

declare global {
    interface Window {
        createElement: any;
        Stack: any
    }
}

window.Stack = Stack;
window.createElement = createElement;