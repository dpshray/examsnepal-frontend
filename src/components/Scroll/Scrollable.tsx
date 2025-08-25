import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Button} from "@/components/ui/button";

export function ScrollableButton() {
    return (
        <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-2 ">
                {Array.from({length: 20}).map((_, index) => (
                    <Button key={index}
                            size={'sm'} variant="outline"
                            className="px-4 py-2 text-sm]  bg-[#E7E7E7] hover:bg-green-500 font-light">
                        Button {index + 1}
                    </Button>
                ))}
            </div>
            <ScrollBar orientation="horizontal" hidden={true}/>
        </ScrollArea>
    );
}
