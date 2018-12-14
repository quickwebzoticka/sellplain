<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();

use Bitrix\Main\Page\Asset;
use Bitrix\Main\UserTable;
use Bitrix\Main\Loader;
use HighLoadWrapper;

function GetGK($USER_ID){
    if($USER_ID) {
        $arFilter = array(array("LOGIC" => "OR", array("ID" => $USER_ID)));
        $res = UserTable::getList(array("select" => array("*", "UF_OBJ"),"filter" => $arFilter));
        $arRes = $res->fetchAll();
        $arUsers = $arRes;
        $flatData = HighLoadWrapper::GetData(['order'  => 'ID','select' => ['ID','UF_OBJECT']],4);

        foreach($flatData as $id => $value){
            $arFlats[$value['ID']]['ID'] = $value['ID'];
            $arFlats[$value['ID']]['UF_OBJECT'] = $value['UF_OBJECT'];
        }

        $arFilterFlat = ['IBLOCK_ID' => 15];
        $arSelectFlat = ['PROPERTY_FLOOR','PROPERTY_KORPUS','PROPERTY_SECTION_OBJECT','ID'];
        $resFlat = CIBlockElement::GetList([], $arFilterFlat, false, false, $arSelectFlat);

        while ($flatDb = $resFlat->GetNext(false, false)) {
            if ((int)$flatDb['PROPERTY_SECTION_OBJECT_VALUE']) {
                $arFlatZhk[intval($flatDb["ID"])]['OBJECT_ID'] = (int)$flatDb['PROPERTY_SECTION_OBJECT_VALUE'];
                $arFlatZhk[intval($flatDb["ID"])]['KORPUS'] = $flatDb['PROPERTY_KORPUS_VALUE'];
            }
        }

        if (CModule::IncludeModule("iblock")) {
            $arUsersObjects = array();
            foreach ($arUsers as $arResultUser) {
                $arContract = array_intersect_key($arFlats, array_flip($arResultUser['UF_OBJ']));
                $arResultUser['CONTRACT'] = $arContract;
                if ($arResultUser['CONTRACT']) {

                    foreach ($arResultUser['CONTRACT'] as &$item)
                        $item = array_merge($item, $arFlatZhk[intval($item['UF_OBJECT'])]);

                    unset($item);
                    array_push($arUsersObjects, $arResultUser);
                }
            }
            $users_zhk = array();
            foreach ($arUsersObjects as $id => $user) {
                foreach ($user['CONTRACT'] as $num => $val) {
                    if (!is_array($users_zhk[$user['ID']]) && $val['OBJECT_ID']) {
                        $users_zhk[$user['ID']] = array();
                    } elseif (!is_array($users_zhk[$user['ID']]) && !$val['OBJECT_ID']) {
                        unset($users_zhk[$user['ID']]);
                        continue;
                    }
                    if (!in_array($val['OBJECT_ID'], $users_zhk[$user['ID']]) && $val['OBJECT_ID']) {
                        if (arParams['SECTION_TYPE'] == 'house') array_push($users_zhk[$user['ID']], $val['OBJECT_ID'] . '_' . $val['KORPUS']);
                        else array_push($users_zhk, $val['OBJECT_ID']);
                    }
                }
            }
            return $users_zhk;
        }
    }
}
global $USER;
$arlk = GetGK($USER->GetID());

$arSelectObject = [ 'IBLOCK_ID', 'ID', 'NAME' ];
$arFilterObject = [ 'IBLOCK_ID' => 15, 'ID' => $arlk, "UF_TYPE" => 10];
$resObj         = CIBlockSection::GetList([], $arFilterObject, false, $arSelectObject);
$gk = "";
while ($temp = $resObj->GetNext()){
    $select = '';
    if($temp['ID'] == $_GET['gk']) $select = 'selected';
        $gk .= '<option value="'.$temp['ID'].'" '.$select.'>'.$temp['NAME'].'</option>';
}

?>

<div class="wrapper search_page">
	<div class="container_head">
		<?/*<div class="row links">
			<div class="col-md-12">
				<a href="#" class="link_root">Мой профиль</a>
				<p>/</p>
				<a href="#" class="link_root">Мои соседи</a>
				<p>/</p>
				<a href="#">Соседи по дому</a>
			</div>
		</div>*/?>
		<div class="row">
			<div class="col-md-12">
				<h2><?=$arParams['PAGE_TITLE']?></h2>
			</div>
		</div>
        <?
        $switch_fild = 0;
        if($_GET['query'])  $switch_fild = 0;
        else if($_GET['nap']) $switch_fild = 1;
        else if(!$_GET['nap'] && !$_GET['query'] && $_GET['gk']) $switch_fild = 2;
        ?>

		<div class="row">
			<div class="col-md-12">
                <form method="get" action="/neighbors/search/">
                    <!-- <div class="radio-block">
                        <label class="radio-row">
                            <div class="radio-choice__radio__wrapper">
                                <input type="radio" name="jk" checked="" value="">
                                <div class="radio-choice__radio__circle"></div>
                                <div class="radio-choice__radio__text">ЖК Наутилус</div>
                            </div>
                        </label>
                         <label class="radio-row">
                            <div class="radio-choice__radio__wrapper">
                                <input type="radio" name="jk" checked="" value="">
                                <div class="radio-choice__radio__circle"></div>
                                <div class="radio-choice__radio__text">ЖК Ясно.Янино</div>
                            </div>
                        </label>
                    </div> -->
                    <div class="search_bar">                        
                        <p class="search_bar__text-under">
                            Найти полезного соседа, например, <span class="bolded">"Парикмахер"</span>
                        </p>
                        <div class="search_bar__nav-bar">
                            <p class="search_bar__nav <?= ($switch_fild == 0)? "active" : ""?>">Поиск по соседям</p>
                            <p class="search_bar__nav <?= ($switch_fild == 1)? "active" : ""?>">Поиск по № квартиры</p>
                            <p class="search_bar__nav <?= ($switch_fild == 2)? "active" : ""?>">Поиск по ЖК</p>
                        </div>
                        <div class="contener-input">
                            <input type="text" name="query" class="search_input search_input__neighbors" value="<?=($_GET['query'] != '')? $_GET['query'] : ""?>" placeholder="Поиск по соседям">
                            <input type="text" maxlength="4" name="nap" class="search_input search_input__apparts" value="<?=$_GET['nap'] != ''? $_GET['nap'] : ""?>" placeholder="Поиск по № квартиры">
                        </div>
                        <button type="submit" style="width: 100px;">Искать</button>
                    </div>
                </form>
			</div>
		</div>
	</div>
    <script>
        BX.message({
            SWITCH_OUT: '<?=$switch_fild?>'
        });
    </script>
	<div class="wrapper search_page">
		<div class="container_main">
			<div class="row">
	    		<?foreach($arResult['USERS'] as $user):

                    $rooms = [];

                    foreach($user['UF_USER_FLATS'] as $temp ){
                        $rooms_temp = explode('|', $temp);
                        $rooms[$rooms_temp[0]] = $rooms_temp;
                    }

                    $keys = array_keys($rooms);
                    $firstKey = $keys[0];

                    $GK = $_GET['gk'] ? $_GET['gk'] : $firstKey;

	    			$address = $rooms[$GK];
                    $showAddress = '';
					if($address[3]) $showAddress .= $address[3];
					if($address[1]) $showAddress .= ', '.$address[1];
					//if($user['UF_ADDRESS_PUBLIC'] == '1'){
						if($address[4]) $showAddress .= ', '.$address[4];
						if($address[5]) $showAddress .= ', '.$address[5];
						if($address[6]) $showAddress .= ', кв. '.$address[6];
					//}
					$img = CFile::GetPath($user['PERSONAL_PHOTO']);
					if(!$img)
						$img = SITE_TEMPLATE_PATH.'/assets/img/prog.png';
	    		?>
					<div class="col-md-3 col-sm-6 col-xs-12">
						<div class="swiper-slide slide-item">
							<div class="wrapper_img">
								<a href="/user/?id=<?=$user['ID']?>">
									<img src="<?=$img?>" alt="prog">
								</a>
							</div>
                            <div class="name__flexbox-wrapper">
                                <?if($user['LAST_NAME'] && $user['UF_SHOW_LASTNAME']):?><div class="name"><?=$user['LAST_NAME']?></div><?endif;?>
                                <?if($user['NAME']):?><div class="name"><?=$user['NAME']?></div><?endif;?>
                            </div>
                            <?if($user['SECOND_NAME'] && $user['UF_SHOW_SECNAME']):?><p class="name"><?=$user['SECOND_NAME']?></p><?endif;?>
							<p class="address"><?=$showAddress?></p>
							<?if($user['USER_SERVICES']):?>
							<div class="specs">
								Услуги
								<div class="specs__wrapper">
									<ul>
										<?foreach($user['USER_SERVICES'] as $service){?>
											<li class="spec"><?=$service['UF_SERVICE_TITLE']?></li>
										<?}?>
									</ul>
								</div>
							</div>
							<?endif;?>
							<button class="write" data-href="#popup-message-neighbors">
								<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 370.88 370.88" style="enable-background:new 0 0 370.88 370.88;" xml:space="preserve">
									<g>
										<g>
											<path d="M355.6,66.16H15.28C6.841,66.16,0,73.001,0,81.44v208c0,8.439,6.841,15.28,15.28,15.28H355.6    c8.439,0,15.28-6.841,15.28-15.28v-208C370.88,73.001,364.039,66.16,355.6,66.16z M15.28,78.16H355.6    c1.436,0.007,2.7,0.947,3.12,2.32L185.44,188.72L12.16,80.48C12.58,79.107,13.844,78.167,15.28,78.16z M12,94.16L136.64,172    L12,270.88V94.16z M358.88,289.36c0,1.812-1.469,3.28-3.28,3.28H15.28c-1.811,0-3.28-1.469-3.28-3.28v-3.2l135.44-107.04    l34.8,21.76c1.955,1.233,4.445,1.233,6.4,0l34.8-21.76l135.44,107.04V289.36z M358.88,270.88l-124.96-98.56l124.96-77.44V270.88z"/>
										</g>
									</g>
								</svg>
								Написать
							</button>
	                        <form style = "display: none" action="<?=$arParams['FORUM_LINK']?>" method="post">
                                <input type="hidden" name="PAGE_NAME" value="pm_edit">
                                <input type="hidden" name="UID" value="<?=$user['ID']?>">
                                <input type="hidden" name="mode" value="new">
	                        </form>
						</div>
					</div>
				<?endforeach;?>
			</div>
		</div>
	</div>
</div>