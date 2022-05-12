import { Observable, map, combineLatest } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OtamatoneService } from 'components/otamatone';
import { PracticeService, Practice } from 'api/practice.service';

@Component({
  selector: 'app-page-practice',
  templateUrl: './practice.component.html',
})
export class PracticePage implements OnInit {
  playedPositions: number[] = [];

  practice$!: Observable<Practice | null>;
  practices$!: Observable<Practice[]>;

  previousDisabled!: Observable<boolean>;
  previousLink!: Observable<string>;

  nextText!: Observable<string>;
  nextLink!: Observable<string>;

  constructor(
    public lessonService: PracticeService,
    public otamatoneService: OtamatoneService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.practices$ = this.lessonService.lessons$;
    this.practice$ = combineLatest([this.route.paramMap, this.practices$]).pipe(
      map(([params, practices]) => {
        const index = Number.parseInt(params.get('index')!);

        if (index > practices.length) {
          return null;
        }

        return practices[index];
      })
    );

    const isFirstPractice: Observable<[Practice | null, boolean]> =
      combineLatest([this.practice$, this.practices$]).pipe(
        map(([practice, practices]) => {
          if (!practice || practice.index >= practices.length) {
            return [null, false];
          }

          if (practice.id === practices[0].id) {
            return [practice, true];
          }

          return [practice, false];
        })
      );

    const isLastPractice: Observable<[Practice | null, boolean]> =
      combineLatest([this.practice$, this.practices$]).pipe(
        map(([practice, overviews]) => {
          if (!practice || practice.index >= overviews.length) {
            return [null, false];
          }

          if (practice.id === overviews[overviews.length - 1].id) {
            return [practice, true];
          }

          return [practice, false];
        })
      );

    this.previousDisabled = isFirstPractice.pipe(
      map(([_, first]) => {
        return first;
      })
    );

    this.previousLink = isFirstPractice.pipe(
      map(([practice, first]) =>
        !first
          ? `/app/learn/${practice ? practice.index - 1 : 0}`
          : '/app/learn'
      )
    );

    this.nextText = isLastPractice.pipe(
      map(([_, last]) => {
        return last ? 'Quiz' : 'Next';
      })
    );

    this.nextLink = isLastPractice.pipe(
      map(([practice, last]) => {
        if (last) {
          return '/app/quiz';
        }

        return `/app/practice/${practice ? practice.index + 1 : 0}`;
      })
    );
  }

  onPlay(position: number): void {
    this.playedPositions.push(position);
  }
}
