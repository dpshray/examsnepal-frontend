import Image from "next/image";
import {heroImage} from "../../../../public/assest";
import {ScrollableButton} from "@/components/Scroll/Scrollable";

export default function LokSewaNotices() {
    return (
        <section className={'mb-4'}>
            <div className={' flex justify-between items-center px-10 '}>
                <h1 className={'w-1/2 text-6xl font-bold max-w-2xl'}>
                    Notices from Lok Sewa Central Office
                </h1>
                <div className={'flex justify-end w-1/2 '}>
                    <Image src={heroImage} alt={'notices'} width={500} height={500}/>
                </div>
            </div>

            {/*Button and Content Area*/}
            <div >
              <div className={'ml-20'}>
                  <ScrollableButton/>
              </div>
            </div>
        </section>
    )
}