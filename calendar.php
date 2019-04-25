<?php
    $title = $title ?? 'Calendar';
    $currentDate = $currentDate ?? date('d/m/Y');
?>
<div class='widget-padding widget-calendar-wrapper'>
    <h1><?= htmlspecialchars($title) ?></h1>
    <div class='widget-calendar-input'>
        <input type='text' name='date' value='<?=$currentDate ?>' />
    </div>
    <div class="widget-calendar-table">
        <div class='widget-triangle background-color-bg'></div>
        <table class='widget-calendar border-color-buttonBG background-color-bg'>
            <thead>
                <tr>
                    <th class='prev-month'><i class="fas fa-chevron-left"></i></th>
                    <th colspan='5'><span class='mounth-name'></span> <span class='year'></span></th>
                    <th class='next-month'><i class="fas fa-chevron-right"></i></th>
                </tr>
                <tr>
                    <th>Mo</th>
                    <th>Ty</th>
                    <th>We</th>
                    <th>Th</th>
                    <th>Fr</th>
                    <th>Sa</th>
                    <th>Su</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</div>