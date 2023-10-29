export default class HandView
{
    loop(funct)
    {
        requestAnimationFrame(funct);
    }

    scrollPage(top)
    {
        scroll({
            top,
            behavior: "smooth"

        });
    }
}